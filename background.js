var doGroup = function() {
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
            alert('going to move properties');
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
            my_titles[i] = my_titles[i].replace(">"," ");
            my_titles[i] = my_titles[i].replace("|"," ");
            my_titles[i] = my_titles[i].replace("-","");
            my_titles[i] = my_titles[i].replace("  "," ");
            alert(my_titles[i]);
        }
                
            data = data.concat(my_titles[0]);
            for(var i = 1 ; i < my_titles.length; i++)
            {
                data = data.concat("\n",my_titles[i]);
            }
            alert("data "+data);
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
                alert(this.responseText);
                for(var j =  0 ;j < tabObject.category_list.length;j++)
                {
                    my_new_titles[count] = my_new_titles[count].concat(" ",tabObject.category_list[j].label);
                    alert('here');
                }
                count++;
                
                if(count == my_titles.length)
                {
                    alert('count finished');
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
document.getElementById('group').addEventListener('click', doGroup);



