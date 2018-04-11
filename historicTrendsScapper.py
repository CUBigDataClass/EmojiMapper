from bs4 import BeautifulSoup
import requests
import json
import time
from datetime import timedelta, date

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)+1):
        yield start_date + timedelta(n)

list_locations={}
with open('data/trends_available.json') as b:
	list_locations=json.load(b)

days_in_month={1:31,2:28,3:31,4:30,5:31,6:20,7:31,8:31,9:30,10:31,11:30,12:31}
outf=open("data/historic_trends.json","a")


outf.write("{")

start_m=10
end_m=11
for i in range(start_m,end_m+1):
	outf.write("\""+str(i)+"\""+": ")

	start_date = date(2016, i, 1)
	end_date = date(2016, i, days_in_month[i])

	trends={}

	daily=open('data/temp_trends.txt',"w")
	for single_date in daterange(start_date, end_date):
		curr_date= single_date.strftime("%Y-%m-%d")

		trends[curr_date]={}
		for l in list_locations["trends_list_location"]:
			if l['country']=="United States":
				trends[curr_date][l["name"]]={}
				r  = requests.get("https://trendogate.com/placebydate/"+str(l["woeid"])+"/"+curr_date)
				soup = BeautifulSoup(r.text,'lxml')
				li=soup.find_all('li',{"class":"list-group-item"})
				for j in range(0,min(10,len(li))) :
					trends[curr_date][l["name"]][j]=li[j].get_text()
					#trends[curr_date][l["name"]][j]=j
		daily.write("{\""+curr_date+" \" : ")
		json.dump(trends[curr_date], daily)
		daily.write("}")
		print(curr_date + " done")
	json.dump(trends,outf)
	if(i!=end_m):
		outf.write(",\n")
	else:
		outf.write("\n }")
outf.close()
daily.close()
