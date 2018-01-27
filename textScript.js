var tabCount = 0;

var  countTabs = function(tabs){
    tabCount = tabs.length;
};

var moveAll = function(tabs){
    tabs.sort(function(a,b){
        if(a.title<b.title) 
           return -1;
        else if(a.title===b.title)
            return 0;
        else
            return 1;
    });
    for(var i =0 ;i < tabCount ;i++){
        var moveProperties = { index: i };
        chrome.tabs.move(tabs[i].id, moveProperties);
    }
};

chrome.tabs.query({ currentWindow: true}, countTabs);
chrome.tabs.query({ currentWindow: true}, moveAll);