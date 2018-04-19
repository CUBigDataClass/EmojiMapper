import json
trend_list={}
with open('data/historic_trends.json') as b:
	trend_list=json.load(b)

reverse_index={}
original=0
unique=0
for month in trend_list.keys():
	reverse_index[month]={}
	for day in trend_list[month].keys():
		reverse_index[month][day]={}
		unique_trend_for_day={}
		print(len(trend_list[month][day].keys()))
		for location in trend_list[month][day].keys():
			for trend in trend_list[month][day][location].keys():
				trend_name=trend_list[month][day][location][trend]
				original=original+1
				#print(trend_name)
				if trend_name in unique_trend_for_day:
					unique_trend_for_day[trend_name].append(location)
				else:
					unique=unique+1
					unique_trend_for_day[trend_name]=[location]
		reverse_index[month][day]=unique_trend_for_day

with open("data/reverse_index.json","w") as outf:
	json.dump(reverse_index,outf)
#print(reverse_index)
#print(original)
#print(unique)
