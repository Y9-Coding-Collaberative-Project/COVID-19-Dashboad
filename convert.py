# convert.py - file io application to read in latest covid19 data and spit out Leaflet.js circles using string concatenation

# Access data from: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports
# Korea, South - Bahamas, The - Gambia, The : Must be manually fixed in the data (South Korea, Bahamas, Gambia) 

# Read file in
fi = open("latest_wrangled_data.csv","r")
fi.readline() # skip over first title line
datarows = fi.readlines()
fi.close()

# Write file out
fo = open("circles.txt","w")

count = 0 # count number of circles

# loop through all rows in the csv file
for line in datarows:
	
	templist = line.split(",")
	province_state = templist[0]
	country_region = templist[1]
	lat = templist[2]
	lon = templist[3]
	confirmed = templist[4]
	deaths = templist[5]
	recovered = templist[6]
	active = templist[7]
	last_update = templist[8]
	
	if (int(confirmed) > 0):
		if (province_state != ""):
			marker = "L.circle([" + lat + "," + lon + "],{color:'red',fillColor:'#f03',fillOpacity:0.5,radius:" + confirmed + "}).addTo(map).bindPopup('" + province_state.replace("'", "") + ", " + country_region.replace("'","") + " : " + confirmed + "');"
		else:
			marker = "L.circle([" + lat + "," + lon + "],{color:'red',fillColor:'#f03',fillOpacity:0.5,radius:" + confirmed + "}).addTo(map).bindPopup('" + country_region.replace("'", "") + " : " + confirmed + "');"
		fo.write(marker + "\n")
		count += 1

print(str(count) + " markers written out")
fo.close()