import json
import pymysql

print('Loading function')

#Configuration Values
endpoint = 'tutorial-db-instance.cy6kirdolrfe.us-east-1.rds.amazonaws.com'
username = 'tutorial_user'
password = '052020Aws-Educate'
database_name = 'cloud'


def lambda_handler(event, context):
	#1. query database
	jobsResponse= query_database()


	#2. Construct http response object
	responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
	responseObject['body'] = json.dumps(jobsResponse)

	#4. Return the response object
	print("Done!")
	return responseObject


def query_database():
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
	result= []
	try:
	    with connection.cursor() as cursor:
	        # Read a single record
	        sql = "SELECT distinct jobName from jobs order by jobName"
	        cursor.execute(sql)
	        result = cursor.fetchall()
	        print(result)
	        #print(type(result))
	        # if(result is None):
	        # 	print("There are no results")
	        # else:
		       #  print(result[0])
		       #  print(result[1])
		       #  newFreq= result[1] + addFreq
	finally:
	    connection.close()
	
	return result