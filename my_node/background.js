chrome.browserAction.onClicked.addListener(function(tab) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var tempTabs;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var arr = new Array(tempTabs.legnth);
            var count = 0;
            var tabObject = JSON.parse(this.responseText);
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
            for ( var i = 0 ; i < tempTabs.length ; i++)
            {
                var moveProperties = {index:arr[i]};
                chrome.tabs.move(tempTabs[i].id,moveProperties);
            }
        }
    });
    var data = "key=f2899c9501ae869ef2bbe29a30785406&lang=en&txt=";
    var moveAll = function(tabs){
        tempTabs = tabs;
        data=data.concat(tabs[0].title);
        for(var i = 1 ; i < tabs.length ; i++){
            data=data.concat("\n",tabs[i].title);
        }
        
        // nlp starts
        alert("hello");
  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '6d03b912-9eba-422b-a221-72af068b300a',
  'password': 'krj5uTdzTUYZ',
  'version_date': '2017-02-27'
});

var parameters = {
  'text': 'IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.',
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2
    }
  }
}

natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    console.log('error:', err);
  else
  //  alert(JSON.stringify(response, null, 2))
   console.log(JSON.stringify(response, null, 2));
});
// nlp ends
        //alert(data);
        //for(var i =0 ;i < tabs.length ;i++){
            //var moveProperties = { index: i };
          //  chrome.tabs.move(tabs[i].id, moveProperties);
        //}
        xhr.open("POST", "http://api.meaningcloud.com/clustering-1.1");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

        xhr.send(data);
    };



    chrome.tabs.query({ currentWindow: true}, moveAll);

    
    
});

