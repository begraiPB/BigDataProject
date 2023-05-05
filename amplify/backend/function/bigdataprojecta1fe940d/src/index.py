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

  

  queryType = event['queryStringParameters']['queryType']

  if queryType == "ageAvgTripDur":
    query_str = "SELECT age, AVG(trip_duration) AS avg_trip_duration FROM bigdataproject.ebikedatatable_001 WHERE age > 1 GROUP BY age;"
    
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

  elif queryType == "genderAvgAge":
    query_str = 'select gender, avg(age) as avg_age FROM "dev"."bigdataproject"."ebikedatatable_001" where age > 1group by gender'
    
    result = client_redshift.execute_statement(Database= 'dev', SecretArn= secret_arn, Sql= query_str, ClusterIdentifier= cluster_id)
    print("API successfully executed")
    time.sleep(2.4)
    response = client_redshift.get_statement_result(
            Id=result['Id']
        )

    data = response['Records']

    output = {}
    for datapoint in data:
        output[datapoint[0]['stringValue']] = datapoint[1]['longValue']

  elif queryType == "yearNumTrips":
    query_str = 'select distinct(st_year) as Year, count(id_no) as Nbr_of_trips from "dev"."bigdataproject"."ebikedatatable_001" group by st_year order by 1;'
    
    result = client_redshift.execute_statement(Database= 'dev', SecretArn= secret_arn, Sql= query_str, ClusterIdentifier= cluster_id)
    print("API successfully executed")
    time.sleep(2.4)
    response = client_redshift.get_statement_result(
            Id=result['Id']
        )

    data = response['Records']

    output = []
    for datapoint in data:
        tup = { "year": datapoint[0]['longValue'], "numtrips": datapoint[1]['longValue']}
        output.append(tup)

  elif queryType == "genderRatio":
    query_str = 'SELECT gender, COUNT(id_no) FROM "dev"."bigdataproject"."ebikedatatable_001" GROUP BY gender;'
    
    result = client_redshift.execute_statement(Database= 'dev', SecretArn= secret_arn, Sql= query_str, ClusterIdentifier= cluster_id)
    print("API successfully executed")
    time.sleep(4)
    response = client_redshift.get_statement_result(
            Id=result['Id']
        )

    data = response['Records']
    print(data)


    output = {}
    for datapoint in data:
        output[datapoint[0]['stringValue']] = datapoint[1]['longValue']


  else:
    output = [5, 5, 1, 1, 1, 1]

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(output)
  }