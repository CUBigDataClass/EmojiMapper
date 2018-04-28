import json
trend_list={}
with open('reverse_index.json') as b:
	reverse_index=json.load(b)


new_format=[]
for month in reverse_index.keys():
	for day in reverse_index[month].keys():
		date_dict={}
		date_dict["date"]=day
		date_dict["trends"]=[]
		date_dict["locations"]={}
		for trend in reverse_index[month][day].keys():
			date_dict["trends"].append(trend)
			date_dict["locations"][trend]=reverse_index[month][day][trend]
		new_format.append(date_dict)

with open("new_reverse_index.json","w") as outf:
	json.dump(new_format,outf)

