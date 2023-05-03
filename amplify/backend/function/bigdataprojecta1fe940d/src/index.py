import json

def handler(event, context):
  print('received event:')
  print(event)

  numbers = [5, 5, 6, 6, 1, 11]
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(numbers)
  }