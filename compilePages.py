import json, copy,  time, pprint, os, re, pathlib, argparse, glob

from html.parser import HTMLParser
from urllib.parse import quote_plus

pp = pprint.PrettyPrinter(indent=1)
os.system("cls")
def filter_files(string):
    if not pathlib.Path(string).exists():
        raise FileNotFoundError('File or path '+string+" doesn't exist")
    try:
        return open(string, "r", encoding='utf8')
    except:
        return pathlib.Path(string)
def ftype(end):
    def check(string, end=end):
        if string.endswith(end):
            return argparse.FileType('w+', encoding="utf8")(string)
        else:
            raise TypeError("Looking for ", end, "file, found other")
    return check
args_parser = argparse.ArgumentParser(
    description='compiles the html pages for mathgames66 from a json file')
args_parser.add_argument('jsonfile', type=argparse.FileType('r', encoding="utf8"),
                         help='the source json file for the parsing. the default value is \"gameData.json\"', default=open("gameData.json", "r", encoding='utf8'), nargs='?')
args_parser.add_argument('-nb', '--no-backup', action='store_true',
                         help='by default, all files are backed up. use this flag to disable')
args_parser.add_argument('-ub', '--use_backups', action="store_true",
                         help='replace main files with backups before use if they exist. if there are multiple possible backups for a file, you\'ll get a choice')
args_parser.add_argument('-bi', '--backup_include', metavar="DIRS / FILES",nargs="+", type=filter_files,
                         help='only backup these files / directories. \nif you want to include all default files, use \"default\" as an argument', default=["default"])
args_parser.add_argument('-bx', '--backup_exclude', metavar="DIRS / FILES", nargs="+", type=filter_files,
                         help='creates a backup for all files with the exception of the listed files')
args_parser.add_argument('-b-pre', '--backup_prefix', metavar="PREFIX",
                         help='as the name suggests, it\'s the prefix for backup files. (example: file.json after -b-pre backup- becomes backup-file.json)')
args_parser.add_argument('-b-suf', '--backup_suffix', metavar="SUFFIX",
                         help='as the name suggests, it\'s the suffix for backup files. (example: file.json after -b-suf -backup becomes file-backup.json)')
args_parser.add_argument('-pd', '--pages-directory', metavar="DIR", type=pathlib.Path,
                         help='which directory to store game pages. the default is "p"', default='p')
args_parser.add_argument('-tp', '--template', metavar="TEMPLATE FILE", type=argparse.FileType('r', encoding="utf8"),
                         help='the template file to base the generated files off of. the default is "p/template"', default='p/template.html')
args_parser.add_argument('-t', '--test', action="store_true",
                         help='create or edit a test file with the first item in the json file')
args_parser.add_argument('-tf', '--test-file', metavar="HTML FILE", type=ftype("html"),
                         help='', default="test.html")

args = args_parser.parse_args()
# def checkForBackups(file):
#     if " " in file.name:
#         raise ValueError("Due to glob being a dummy dumb-dumb, files and directories can't have spaces when looking for backups\nPlease use a file with underscores or dashes")
#     fileEnd = file.name[file.name.rfind("."):]
#     to_glob = r"*{0}*{1}" 
#     to_glob = to_glob.format(file.name.replace(fileEnd,""), fileEnd)
#     files = glob.glob(to_glob)
#     usr_input = ""
#     files.remove(file.name)
#     length = list(range(len(files)))
#     for x in range(len(length)): 
#         length[x] = str(length[x]+1) # type: ignore - it thinks x is a string 
#     while usr_input not in length:
#         print("which file would you like to use for", file.name+"?", "1 to", len(length))
#         for count,backup_file in enumerate(files,1):
#             print(f'\033[1m\033[33m{count}. \033[0m\033[96m{backup_file}')
#         usr_input = input("\033[0m> ")
#     print('\033[37m'+"\n\t".join(re.split(", |,| |\(|\)",str(args))))
# checkForBackups(args.jsonfile)
# checkForBackups(args.test_file)
# try:
#     json_array = json.load(args.jsonfile)
# except json.decoder.JSONDecodeError:
#     print("\033[91mERROR: Expected JSON file, received either non-json file or corrupted json")
#     exit()
# if args.no_backup and args.backup_include:
#     print("\033[93mWARNING: You don't need to clarify no_backup and backup_include")
# try: 
#     json_array[0]
# except KeyError:
#     print("\033[31mERROR: JSON file must be an array")
#     exit()
timeSec = 1
os.system("rmdir p /s /q")
os.system("robocopy \"p copy\" p")


class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "iframe" or tag == "embed":
            # print("Start tag:", tag)
            global frame_tag
            frame_tag = tag
            global iframe_attributes
            iframe_attributes = attrs


            # for attr in attrs:
            #     try:
            #         list(attr)
            #         attr = int(attr)
            #     except:
            #         print(":(")
            # print("     attr:", attr)
html_parser = MyHTMLParser()

html_file = open("p/template.html", "r", encoding='utf8')
html_string = html_file.read()
# with open("gameData [BACKUP 2].json", "r", encoding='utf8') as backup:
with open("gamedata.json", "r", encoding='utf8') as json_file:

    json_array = json.load(json_file)
    for object_index in range(len(json_array)):
        temp_obj = copy.deepcopy(json_array[object_index])
        test_html_file = open(
            "p/" + temp_obj['url']+".html", "w+", encoding='utf8')
        # try:
            # time.sleep(timeSec)
        # except:
            # timeSec = float(input("What's the new time?"))
        # for idx, item in enumerate(json_array):
        print("INDEX: --", object_index, "\nFILE: --", test_html_file.name)
        # if not hasattr(json_array[object_index]["pageData"]["attributes"] ,"style"):
        #     json_array[object_index]["pageData"]["attributes"]["style"] = ""
        #     for k, i in temp_obj["pageData"]["attributes"].items():
        #         print(k, i)
        #         if k == "width" or k == "height":
        #             del json_array[object_index]["pageData"]["attributes"][k]
        #             json_array[object_index]["pageData"]["attributes"]["style"] += k + ': ' + str(i) + 'px; '
        temp_obj = copy.deepcopy(json_array[object_index])
        temp_obj["pageData"]["attr_string"] = ""
        temp_obj["tagsCompiled"] = ""
        temp_obj["seriesCards"] = ''
        temp_obj["quote_creator"] = ''
        temp_obj["quote_uploader"] = ''
        if temp_obj["series"]:
            series_cards = [x for x in json_array if x['series'] == temp_obj['series']]
            print("SERIES: --",temp_obj["series"])
            for x in series_cards:
                temp_obj["seriesCards"] += f'<a href="{x["url"]}.html"><div class="card"><img src="../mgthumbnails/{x["thumbnailURL"]}"><h3>{x["dispName"]}</h3><p>by {x["creator"]}</p></div></a>'
            temp_obj["series"] = quote_plus(temp_obj["series"])
        else:
            temp_obj["series"] = ""
            print("--NO SERIES [:(]")
        try:
            print(temp_obj["metaTags"])
        except:
            temp_obj["metaTags"] = ""
            print("--NO META TAGS")
        temp_obj["quote_creator"] = quote_plus(temp_obj["creator"])
        temp_obj["quote_uploader"] = quote_plus(temp_obj["uploader"])
        print("CREATOR IN URL: --", temp_obj["quote_creator"])
        print("UPLOADER IN URL: --", temp_obj["quote_uploader"])
        print(temp_obj["siteTags"])
        for i in temp_obj["siteTags"]:
            tag_link =  "../search?tags="+"+".join(i.split(" "))
            print(tag_link)
            temp_obj["tagsCompiled"] += f"<a class=\"tag-block\" href=\"{tag_link}\">{i}</a>"

        for k, i in temp_obj["pageData"]["attributes"].items():
        #     if k == "width" or k == "height":
        #         del json_array[object_index]["pageData"]["attributes"][k]
        #         json_array[object_index]["pageData"]["attributes"]["style"] += k + \
        #             ': ' + i + 'px; '
            try:
                temp_obj["pageData"]["attr_string"] += k + '="' + i + '" '
            except:
                temp_obj["pageData"]["attr_string"] += k + " "
        temp_obj["pageData"]["attributes"] = temp_obj["pageData"]["attr_string"]
        test_html_string = html_string.format_map(temp_obj)
        test_html_file.write(test_html_string)
        test_html_file.close()

        # for idx, item in enumerate(cjson_array):
        # print(idx)
        # site = open("p/"+item['url']+".html", "r",encoding='utf8')
        # site_str = site.read()
        # parser.feed(site_str)
        # site.close()
        # item.update({"pageData": {'is_frame': frame_tag, 'attributes': {}}})
        # for attr in iframe_attributes:
        #     item['pageData']['attributes'][attr[0]] = attr[1]
    # c
# parser = MyHTMLParser()
# parser.feed(html_string)
