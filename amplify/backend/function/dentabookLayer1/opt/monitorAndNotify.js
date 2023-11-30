const {
  CloudWatchClient,
  PutMetricDataCommand,
  PutMetricAlarmCommand,
} = require('@aws-sdk/client-cloudwatch');
const {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

const cloudWatchClient = new CloudWatchClient();
const cloudWatchLogClient = new CloudWatchLogsClient();

export const monitorAndNotify = async (
  namespace,
  context,
  error,
  actionARN
) => {
  try {
    const { functionName } = context;
    const MetricName = functionName;
    const AlarmName = `${functionName}-error`;
    const Namespace = namespace; // 'dentaBook'
    // create/update metric
    const input = {
      MetricData: [
        {
          MetricName: MetricName,
          Timestamp: new Date(),
          Unit: 'Count',
          Value: 1.0,
        },
      ],
      Namespace: Namespace,
    };
    const command = new PutMetricDataCommand(input);
    const response = await cloudWatchClient.send(command);
    console.log('create/update a metric data, ', response);
    // create/update alarm
    let actions = [];
    actions.push(actionARN);
    const alarmParams = {
      AlarmName: AlarmName,
      MetricName: MetricName,
      Namespace: Namespace,
      Threshold: 1.0,
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      Statistic: 'Sum',
      EvaluationPeriods: 1,
      Period: 360,
      AlarmActions: actions,
    };
    const alarmCommand = new PutMetricAlarmCommand(alarmParams);
    const alarmResponse = await cloudWatchClient.send(alarmCommand);
    console.log(
      'create/update the alarm based off of the metric, ',
      alarmResponse
    );
    //create a new log stream and add a new log
    const logStreamName = `${Date.now()} ${functionName}`;
    await cloudWatchLogClient.send(
      new CreateLogStreamCommand({
        logGroupName: `/aws/lambda/${namespace}_errors/${functionName}`,
        logStreamName: logStreamName,
      })
    );
    console.log('a new log stream has been created');
    // create a new log
    const logParams = {
      logGroupName: `/aws/lambda/${namespace}_errors/${functionName}`,
      logStreamName: logStreamName,
      logEvents: [
        // InputLogEvents // required
        {
          // InputLogEvent
          timestamp: Date.now(), // required
          message: JSON.stringify(error), // required
        },
      ],
    };
    await cloudWatchLogClient.send(new PutLogEventsCommand(logParams));
    console.log('a new log has been added to the log stream');
  } catch (error) {
    console.log('monitor and notify failed: ', error);
  }
};
