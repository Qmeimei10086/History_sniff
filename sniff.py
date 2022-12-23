from urllib import response
from flask import Flask, render_template, request
from color_output import*

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html",url_list=str(url_list))

@app.route('/get_result',methods=['GET'])
def get_result():
    visited_url = []
    res = request.args.get("url_list")
    print_windows("\n[*]access from: "+request.remote_addr,"yellow")
    print_windows("=============================","yellow")
    for url in res.split(","):
        visited_url.append(url)
    for url in url_list:
        if url in visited_url:
            print_windows(("[+]Visited ->" + url),"green")
        elif url not in visited_url and url != '':
            print_windows(("[-]Unvisited ->" + url),"red")
    print_windows("=============================\n","yellow")
    return "OK"
    
if __name__ == '__main__':
    url_list = []
    with open("url_list.txt","r") as f:
        line  =  f.readline()
        while line:  
            url_list.append(line.replace('\n',''))
            line  =  f.readline()
    
    app.run(host='0.0.0.0', port=8080, debug=True)
