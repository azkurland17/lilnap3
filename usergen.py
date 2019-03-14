import requests
import json
import random

num_users = 100
num_moves = 50

# bot stuff
curr_page = "error"

# request stuff
headers = ''
cookies = ''
browserChoice = ''

pages = ['home', 'donate', 'learn', 'error']

option = ['navigate', 'event', 'error']

pages_routes = {
    'outside': ['home', 'home', 'home', 'home', 'home', 'home', 'home', 'home', 'home', 'donate', 'donate', 'donate', 'donate', 'learn', 'learn', 'error'],
    'home': ['donate', 'donate', 'donate', 'donate', 'donate', 'donate', 'donate', 'learn', 'learn', 'learn', 'error'],
    'donate': ['home', 'home', 'home', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn'],
    'learn': ['donate', 'donate', 'donate', 'donate', 'donate', 'donate', 'home', 'home', 'home', 'home'],
    'error': ['home']
}

page_event_buttonIDs = {
    'home': ['homebutton1', 'homebutton1', 'homebutton1', 'homebutton1', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton2', 'homebutton3'],
    'donate': ['donate1', 'donate1', 'donate1', 'donate1', 'donate1', 'donate1', 'donate2', 'donate3', 'donate3', 'donate3', 'donate3', 'donate3', 'donate3', 'donate4', 'donate4', 'donate4', 'donate5', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate6', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate7', 'donate8'],
    'learn': ['learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn1', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn2', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn3', 'learn4', 'learn4', 'learn4', 'learn4', 'learn4', 'learn4', 'learn5', 'learn6', 'learn6', 'learn6', 'learn6', 'learn6', 'learn6', 'learn6', 'learn6', 'learn7', 'learn8', 'learn9', 'learn9', 'learn9', 'learn9', 'learn9', 'learn10', 'learn11', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12', 'learn12'],
    'error': ['errorbutton1', 'errorbutton2', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton3', 'errorbutton4', 'errorbutton5', 'errorbutton6']
}

page_errors = {
    'home': ['EvalError', 'InternalError', 'InternalError', 'InternalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'],
    'donate': ['EvalError', 'EvalError', 'EvalError', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'ReferenceError', 'SyntaxError', 'SyntaxError', 'TypeError', 'URIError'],
    'learn': ['EvalError', 'InternalError', 'InternalError', 'InternalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'SyntaxError', 'SyntaxError', 'SyntaxError', 'SyntaxError', 'TypeError', 'URIError'],
    'error': ['EvalError', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError']
}

browser_render_multipliers = {
    'Chrome': 0.8,
	'Firefox': 0.95,
	'Edge': 1.5,
	'Safari': 0.85,
	'Opera': 2.2,
	'UC Browser': 1.1
}

page_render_times = {
	'home': 135,
    'donate': 50,
    'learn': 100,
    'error': 150
}


def generateHeaders():
    global headers
    global browserChoice
    os = ['Windows 7.0.6', 'Windows 10.0.0', 'Mac OS X 10.13', 'Windows 8.1',
          'Mac OS X 10.12', 'Linux', 'Windows 8.9.1', 'Mac OS X 10.11', 'Ubuntu 4.1.5']
    browser = ['Chrome', 'Chrome', 'Chrome', 'Chrome', 'Chrome', 'Firefox', 'Firefox',
        'Firefox', 'Edge', 'Edge', 'Safari', 'Safari', 'Safari', 'Safari', 'Opera', 'UC Browser']
    browserChoice = random.choice(browser)
    headers = {'User-Agent': 'Mozilla/5.0 ' + '(' + random.choice(os) + ')'
               + ' AppleWebKit/537.36 (KHTML, like Gecko)  ' + browserChoice
               + '/72.0.3626.119 ' + browserChoice + '/42.0',
               'Referer': curr_page}


def submitPerformance():
    print("submitting performance")
    if(curr_page is not "outside"):
		render_time = page_render_times[curr_page];
		print(render_time)
		render_time = render_time + random.randint(-15, 15)
		print(render_time)
		render_time = render_time * browser_render_multipliers[browserChoice];
		print(render_time)
		requests.post("http://localhost:3000/performance", data={'render_time': render_time},headers=headers, cookies=cookies)


def navigateTo():
    print("navigating to new page")
    submitPerformance()
    global headers
    global cookies
    global curr_page
    global page_routes
    page = random.choice(pages_routes[curr_page])

    r = requests.get("http://localhost:3000/" + page,
                     headers=headers, cookies=cookies)

    curr_cookies = r.cookies.get_dict()
    if 'visitor' in curr_cookies:
        cookies = curr_cookies

    curr_page = page
    headers['Referer'] = curr_page


def submitEvent():
    print("submitting event")
    if(curr_page is not "outside"):
        buttonID = random.choice(page_event_buttonIDs[curr_page])

        r = requests.post("http://localhost:3000/event", data={'buttonID': buttonID},
                          headers=headers, cookies=cookies)


def submitError():
    print("submitting error")
    if(curr_page is not "outside"):
        error_message = random.choice(page_errors[curr_page])

        r = requests.post("http://localhost:3000/error", data={'page_source': curr_page, 'error_type': error_message, 'lineno': 9},
                          headers=headers, cookies=cookies)


def makeDecision():
    choices = [navigateTo, submitEvent, submitEvent, submitEvent,
               navigateTo, submitEvent, submitEvent, submitEvent, submitError]
    choice = random.choice(choices)
    if curr_page is "outside":
        navigateTo()
    else:
        choice()


def main():
    user_num = 0
    while user_num < num_users:
        global cookies
        global headers
        global curr_page

        cookies = ''
        curr_page = 'outside'

        generateHeaders()
        print(json.dumps(headers))
        move_num = 0
        while move_num < num_moves:
            makeDecision()
            move_num += 1

        user_num += 1


main()
