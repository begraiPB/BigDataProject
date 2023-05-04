import os
import json
import boto3
import botocore 
import botocore.session as bc
from botocore.client import Config
import time

print('Loading function')

secret_name="redshiftCred" # getting SecretId from Environment varibales
session = boto3.session.Session()
region = session.region_name

# Initializing Secret Manager's client    
client = session.client(
    service_name='secretsmanager',
        region_name=region
    )

get_secret_value_response = client.get_secret_value(
        SecretId=secret_name
    )
secret_arn=get_secret_value_response['ARN']

secret = get_secret_value_response['SecretString']

secret_json = json.loads(secret)

cluster_id=secret_json['dbClusterIdentifier']

# Initializing Botocore client
bc_session = bc.get_session()

session = boto3.Session(
        botocore_session=bc_session,
        region_name=region
    )

# Initializing Redshift's client   
config = Config(connect_timeout=5, read_timeout=5)
client_redshift = session.client("redshift-data", config = config)


def handler(event, context):
  print('received event:')
  print(event)

  numbers = [5, 5, 1, 1, 1, 1]
  query_str = "SELECT age, AVG(trip_duration) AS avg_trip_duration FROM bigdataproject.ebikedatatable_001 GROUP BY age;"
  
  result = client_redshift.execute_statement(Database= 'dev', SecretArn= secret_arn, Sql= query_str, ClusterIdentifier= cluster_id)
  print("API successfully executed")
  time.sleep(2.4)
  response = client_redshift.get_statement_result(
        Id=result['Id']
    )

  data = response['Records']

  output = []
  for datapoint in data:
    tup = { "age": datapoint[0]['longValue'], "avg_trip_duration": datapoint[1]['longValue']}
    output.append(tup)

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(output)
  }