var doGroup = function() {
    myFunc();
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var tempTabs;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var arr = new Array(tempTabs.length);
            var count = 0;
            var tabObject = JSON.parse(this.responseText);
            alert(this.responseText);
            for ( var i = 0 ; i < tabObject.cluster_list.length ; i++ )
            {
                var keys = Object.keys(tabObject.cluster_list[i].document_list);
                for ( var j = 0 ; j < keys.length ; j++ )
                {
                    var num = Number(keys[j]);
                    if(typeof arr[num-1] === 'undefined')
                    {
                        arr[num-1]=count;
                        count++;
                    }
                }
            }
            document.getElementById('group').innerHTML = "By Content";
            for ( var i = 0 ; i < tempTabs.length ; i++)
            {
                var moveProperties = {index:arr[i]};
                chrome.tabs.move(tempTabs[i].id,moveProperties);    
            }
            
        }
    });
    var data = "key=536589752258a422b8dc6d26e1127a13&lang=en&txt=";
    var moveAll = function(tabs){
        tempTabs = tabs;
        my_urls = [];
        var my_titles = [];
        my_titles.concat(tabs[0].title);
        for(var i = 1 ; i < tabs.length ; i++){
            my_titles=my_titles.concat(tabs[i].title);
            my_urls = my_urls.concat(tabs[i].url);
        }
        preprocess(my_titles);
    };
    
    var func = function(my_titles){
        for ( var i = 0 ;i < my_titles.length ; i++)
        {
            my_titles[i] = my_titles[i].replace("Uncategorized","");
            my_titles[i] = my_titles[i].replace("/[^a-zA-Z? ]/g, "," ");
            my_titles[i] = my_titles[i].replace("  "," ");
            
        }
                
            data = data.concat("\n",my_titles[0]);
            for(var i = 1 ; i < my_titles.length; i++)
            {
                data = data.concat("\n",my_titles[i]);
            }
            xhr.open("POST", "http://api.meaningcloud.com/clustering-1.1");
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            
            xhr.send(data);
    }
    var count = 0;
    var preprocess = function (my_titles){
        var my_new_titles = new Array(my_titles.length);
        for( var i = 0 ;i < my_titles.length ; i++)
        {
            var data = "key=536589752258a422b8dc6d26e1127a13&txt=";
            data = data.concat(my_titles[i],"&model=IAB_en");
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === this.DONE) {
                
                var tabObject = JSON.parse(this.responseText);
                my_new_titles[count] = my_titles[count];
                for(var j =  0 ;j < tabObject.category_list.length;j++)
                {
                    my_new_titles[count] = my_new_titles[count].concat(" ",tabObject.category_list[j].label);
                }
                count++;
                
                if(count == my_titles.length)
                {
                    func(my_titles);
                }
              }
            });

            xhr.open("POST", "http://api.meaningcloud.com/class-1.1");
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

            xhr.send(data);

            function sleep(milliseconds) {
                var start = new Date().getTime();
                var final=start+milliseconds;
                while(start<=final){
                    start = new Date().getTime();
                }
            }
            sleep(1500);
        }
    };
    
    chrome.tabs.query({ currentWindow: true}, moveAll);
};

var myFunc = function(){
    document.getElementById('group').innerHTML = "Waiting";
}

var doTitle = function()
{
    var move = function(tabs){
        tabs.sort(function(a,b){
            if(a.title<b.title)
                return -1;
            else if(a.title.toLowerCase()===b.title.toLowerCase())
                return 0;
            else
                return 1;
        });
        for ( var i = 0 ; i < tabs.length ; i++ )
        {
            var moveProperties = {index : i};
            chrome.tabs.move(tabs[i].id,moveProperties);
        }
    }
    chrome.tabs.query({ currentWindow: true}, move);
}

var doUrl = function()
{
    var move = function(tabs){
        tabs.sort(function(a,b){
            if(a.url<b.url)
                return -1;
            else if(a.url.toLowerCase()===b.url.toLowerCase())
                return 0;
            else
                return 1;
        });
        for ( var i = 0 ; i < tabs.length ; i++ )
        {
            var moveProperties = {index : i};
            chrome.tabs.move(tabs[i].id,moveProperties);
        }
    }
    chrome.tabs.query({ currentWindow: true}, move);
}

var doAll = function(){
    document.location.href = "AllTabs.html";
}
document.getElementById('group').addEventListener('click', doGroup);
document.getElementById('title').addEventListener('click', doTitle);
document.getElementById('url').addEventListener('click', doUrl);
document.getElementById('doAll').addEventListener('click',doAll);
