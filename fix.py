import os, pprint, copy, json

no_index_page = []
no_folder = []
main_dir = []
main_dir_const = []
yo = os.listdir("games/html5")
for i in yo:
	# print(i)
	main_dir.append(f"html5/{i}")
for i in os.listdir("games/flash/"):
	# print(i)
	main_dir.append(f"flash/{i}")
pp = pprint.PrettyPrinter(indent=4)
main_dir_const += main_dir
with open("gamedata.json", "r", encoding="utf8") as game_json:
	json_array = json.load(game_json)
	temp_obj = copy.deepcopy(json_array)
	for i, x in enumerate(temp_obj):
		path = "html5" if x["pageData"]["isFrame"]=="iframe" else "flash"
		assum_dir = f"games/{path}/{x['name']}"
		print("\033[92m",assum_dir)
		if os.path.exists(assum_dir):
			print(f"\033[94m{path}/{x['name']}")
			if os.path.exists(assum_dir+"/index.html"):
				x["pageData"]["attributes"]["src"]=assum_dir
				main_dir.remove(f"{path}/{x['name']}")
			elif os.path.exists(assum_dir+"/*.html"):
				x["pageData"]["attributes"]["src"]=assum_dir
				main_dir.remove(f"{path}/{x['name']}")
			elif os.path.exists(assum_dir+f"/{x['name']}.swf"):
				x["pageData"]["attributes"]["src"]=assum_dir+f"/{x['name']}.swf"
				main_dir.remove(f"{path}/{x['name']}")
			else:
				no_index_page.append(i)
		else:
			no_folder.append(i)
	temp1 = []
	temp2 = []
	for i in no_index_page:
		temp1.append(main_dir_const[i])
	for i in no_folder:
		temp2.append(main_dir_const[i])
	print("No index:",temp1)
	print("Folder not found:",temp2)
	# for i in no_folder:
		# print(temp_obj[i]["name"])
	