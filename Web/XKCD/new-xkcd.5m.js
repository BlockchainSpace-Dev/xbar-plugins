#!/usr/bin/env /usr/local/bin/node

/*
# <bitbar.title>New XKCD</bitbar.title>
# <bitbar.version>v1.0.0</bitbar.version>
# <bitbar.author>Rob Tarr</bitbar.author>
# <bitbar.author.github>robtarr</bitbar.author.github>
# <bitbar.desc>Check for new XKCD comic</bitbar.desc>
# <bitbar.dependencies>node</bitbar.dependencies>
# <bitbar.abouturl>https://github.com/robtarr/bitbar-plugins</bitbar.abouturl>
*/

const https = require("https");
const fs = require('fs');

const url = 'https://xkcd.com/atom.xml';
const icon = '| image=AAABAAIAEBAAAAAAAABoBQAAJgAAACAgEAAAAAAA6AIAAI4FAAAoAAAAEAAAACAAAAABAAgAAAAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAJycnABGRkYAenp6AIODgwAkJCQA6+vrAIyMjAAdHR0A29vbAHx8fAAvLy8Ajo6OADg4OAD///8AFhYWAEpKSgB+fn4AsrKyACgoKAAGBgYA+Pj4AKKiogDW1tYAd3d3AICAgAAqKioAiYmJAOjo6AC9vb0AXl5eAPHx8QBnZ2cA+vr6AHBwcADh4eEAgoKCAIuLiwBgYGAA8/PzAJ2dnQBHR0cAe3t7AOPj4wAlJSUAn5+fANPT0wB0dHQAsbGxAFtbWwCPj48AMDAwADk5OQChoaEAdnZ2AH9/fwApKSkAiIiIAJqamgBvb28AeHh4ANfX1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0zADc7NwAzMwAEBAATNzM8DgAODg4ADg4ADg4ADg48Ig4aKg4DGg4OKTASDQ4OIiIOKggOOAMODi00NDUODiIZIA4AKAAOHgkOAAAOLh08OQ8bDgAOGwUAFQwMFQAjGBgfAA4ADgAcIQACAgAnDiIiDiQsACwkDgEQAAAQAQ4iIg4OFgAWDg4CAAAAAAIOIiIOJAAAACQOLxEODjsvDiIYKxQXDhcUKzYlDg4OJg4iGTs9Dg4OPTsyAAcOIjsOIhkYPA4ODjw2BwAAAAAKDiIYBgALMgsACQ4xAAAxDg4iPA46AAAAOg4ODg4ODg4OPDMYEQwyDBE7Ozs7Ozs7GDMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAEAAAAAAAAAgAAAAAAAAAAAAAQAAAAAAAAAAAAAADPz88A39/fACAgIAD///8AcHBwAICAgACQkJAAoKCgANfX1wAoKCgAf39/AIiIiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEAAREREAARAAEREAAREQAREAERERABERABERABEREAERABEREQAREQAVEUARERABEQwNERDA0REYHRHDEREQAREQAREQAREREAEQAFEREAEREAJREAERERABmAERERABERDCkQwNERETAiAxEREQARERABEAEREREEAABREREAEAEQwAANEADREMANEQwRABAA0QwA0QwADREAERDA0QARABEQAREAEMDRABEMDREAEQwNEAEQwNEMDQAQwNERABEQwNABDA0REMAAAA0REQAREQAQAQAREREAAAAREREAEREMAAAA0RFAAAAAABURABEREMAADRERQAAAAAAVEQAREREQAREREQAAAAAAEREAEREQwAANEREADREQwBERABEQwAAAAA0RAJEREQgREQAREAAREQABEQEREREQEREAEQwRERERANEADREREBERABEAEREREQARAADREQwREQARAREREREQEQAAERCAEREAEQARERERABEAAAAAABERABEAEREREQARDAAAAADREQARDAAREQAA0RDAAAANEREAERAAAAAAARERLAAC0RERABEQwAAAAA0REREREREREQARERDAAA0REREREREREREAERERERERERERERERERERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
const errorIcon = '| image=iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAAAAACo4kLRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGVWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHRpZmY6Q29tcHJlc3Npb249IjEiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMSIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTAtMTdUMTU6MTQ6MzEtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTE3VDE1OjIzOjMwLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTE3VDE1OjIzOjMwLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkdlbmVyaWMgR3JheSBQcm9maWxlIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIwMTQ1YjIyLWU1NzMtNDI4Ni1iNDgyLTMxYjA0YWQ0NDJhYyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NmZkNmU2NS0xNjEwLTQ2ZjItYTJiNy02YTU0MzA3YTRiNGMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1NmZkNmU2NS0xNjEwLTQ2ZjItYTJiNy02YTU0MzA3YTRiNGMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NmZkNmU2NS0xNjEwLTQ2ZjItYTJiNy02YTU0MzA3YTRiNGMiIHN0RXZ0OndoZW49IjIwMTktMTAtMTdUMTU6MjE6NTItMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjAxNDViMjItZTU3My00Mjg2LWI0ODItMzFiMDRhZDQ0MmFjIiBzdEV2dDp3aGVuPSIyMDE5LTEwLTE3VDE1OjIzOjMwLTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+olXGbQAAAUtJREFUGJVt0M9KAmEABPDZ9ds1NRGlbaOkBSmi8FTgoUOF1EkihHqBnqAXiPIBrFuHLoVQ1CEpCIKCCiQqFNKyUPuDEAsGuYa6mdr6dTADsTn+mLkMIrQlMot/0sDvS7UFE5tKMNOE6okSmvIMXP0hAcAn0pIEZ7GpSbSvnl2cxhvGsACeuWTUubFSywIANJljAfTOc8HQuX8mDACI+XMEAA+XXVhyvJD62uFj2wE8xQIuK6QqAKiWfJxEA0Zd0bKQSgliBgBMN8k1sj/Up7eLBjk5vCMCr++EjDFkcBEA0KEJ/ET+QBSsSmKSdRcAAGUaNmdJmr7tHbkkHKuUUkorZ0Fl+55GZqczVCa/j3A5avVuGUZWbxlUWVWr66MJbd6Hdd/13EUnKaRt1VpJX+keBWyeZe+4+5NnDvtLDKPpyl3GEkBsug8zc/cDY8OIy7Tw+C0AAAAASUVORK5CYII=';

function isNew(xml) {
  const updatedOn = xml.match(/<updated>(.*?)Z<\/updated>.*/);
  if (!updatedOn || !updatedOn[1]) return false;

  const updatedDate = new Date(updatedOn[1]);
  return updatedDate.getDay() === new Date().getDay();
}

https.get(url, res => {
  res.setEncoding('utf8');
  let body = '';
  res.on('data', data => {
    body += data;
  });
  res.on('end', () => {
    if (isNew(body)) {
      console.log(icon);
      console.log('---');
      console.log('xkcd.com | href=http://www.xkcd.com');
    }
  });
});