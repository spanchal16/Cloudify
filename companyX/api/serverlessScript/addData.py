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
	print(event)
	body= json.loads(event['body'])
	jobsResponse= query_database(body)


	#2. Construct http response object
	responseObject = {}
	responseObject['statusCode'] = 200
	responseObject['headers'] = {}
	responseObject['headers']['Content-Type'] = 'application/json'
	responseObject['body'] = json.dumps(jobsResponse)

	#4. Return the response object
	print("Done!")
	return responseObject


def query_database(body):
	#Connection
	connection = pymysql.connect(endpoint, user=username, passwd=password, db=database_name, charset='utf8mb4',
	                         cursorclass=pymysql.cursors.DictCursor)
	# result= {"status": 'unsuccess'}
	
	partId= body['partId']
	jobName= body['jobName'] 
	qty= body['qty']
	
	try:
		with connection.cursor() as cursor:
			# Read a single record
			sql = "SELECT * FROM jobs WHERE jobName = %s AND partId = %s"
			cursor.execute(sql, (jobName, int(partId)) )
			result = cursor.fetchone()
			
			if(result is not None):
				result= {"status": 'unsuccess', "code": '400', "message": "jobName: " + jobName + " with " + "partId: " + str(partId) + " already exist, can't be added."}
			else:
				with connection.cursor() as cursor:
					sql = "INSERT INTO jobs VALUES (%s, %s, %s)"
					cursor.execute(sql, (jobName, int(partId), qty ) )
					connection.commit()
					result= {"status": 'success'}
				
	except pymysql.Error:
	    raise RuntimeError(
	"Cannot connect to database. "
	"Create a group of connection parameters under the heading "
	"[pandas] in your system's mysql default file, "
	"typically located at ~/.my.cnf or /etc/.my.cnf.")
	finally:
	    connection.close()
	
	return result