var tempTabs;
var func = function(tabs){
    tempTabs = tabs;
    var div1 = document.getElementById('div1');
    for(var i = 0 ; i < tabs.length ; i++ )
    {
        var button = document.createElement('input');
        button.setAttribute('type','button');
        button.setAttribute('value',tabs[i].title);
        button.setAttribute('id',i.toString());
        button.setAttribute('style','background-color: #4CAF50;border: 1px solid green;color: white;padding: 8px 50px;cursor: pointer;width: 100%; display: block;');
        button.addEventListener('click',myfunc);
        div1.appendChild(button);
        
    }
};
var myfunc = function()
{
    chrome.tabs.update(tempTabs[Number(this.id)].id, {active: true, highlighted: true});
}
chrome.tabs.query({currentWindow:true},func);
