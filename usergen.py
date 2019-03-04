import requests
import json
import random
j=0
while j< 1000:
	print("HEEEEEEEEEEEEEEEEEY")
	os = ['Windows 7.0.6', 'Windows 10.0.0', 'Mac OS X 10.13', 'Windows 8.1', 'Mac OS X 10.12', 'Linux', 'Windows 8.9.1', 'Mac OS X 10.11', 'Ubuntu 4.1.5'];
	browser = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera', 'UC Browser' ];
	browserChoice = random.choice(browser);
	headers = {'User-Agent': 'Mozilla/5.0 ' + '('+ random.choice(os) + ')' +
	 ' AppleWebKit/537.36 (KHTML, like Gecko) '+browserChoice+ '/72.0.3626.119 '+ browserChoice +'/42.0' }
	print(json.dumps(headers));
	r = requests.get("http://104.248.219.235:3000/", headers=headers)
	i=0
	while i<random.randint(1,10):
		log_types = {
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"error":["erroneousFunction"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"],
		"event":["donate", "learn"]
		}

		logType = log_types.keys()[random.randint(0,len(log_types)-1)]
		print(logType)
		buttonType = random.choice(log_types[logType])
		print(buttonType)




		headers = {'Content-Type': 'application/json'}
		payload = {'buttonType': buttonType, 'logType': logType}
		cookies = {'cookieName': r.cookies['cookieName']}

		p = requests.post("http://104.248.219.235:3000/api/log/event", data=json.dumps(payload), headers=headers, cookies=cookies)

		print(p)
		i += 1;
	#j += 1;
