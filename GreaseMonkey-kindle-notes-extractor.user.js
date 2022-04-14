// ==UserScript==
// @name     		Kindle notes extractor
// @version  		1.0.0
// @description Extract notes from kindle to markdown format suitable for Obsidian.
// @license			GPL V3
// @author      Yann Charlou
// @grant    		none
// @include  		https://read.amazon.com/notebook/*
// @updateURL   https://raw.githubusercontent.com/yanncharlou/GreaseMonkeyKindleNotesExtractor/main/GreaseMonkey-kindle-notes-extractor.user.js
// @downloadURL https://raw.githubusercontent.com/yanncharlou/GreaseMonkeyKindleNotesExtractor/main/GreaseMonkey-kindle-notes-extractor.user.js
// @supportURL  https://github.com/yanncharlou/GreaseMonkeyKindleNotesExtractor/issues
// ==/UserScript==

(function() {
    'use strict';
  
  	function initKindleExtractor(){
      console.log("Kindle notes extractor : launched");

      var range = document.createRange();
      var btnFragment = range.createContextualFragment("<input type='button' id='extract-to-md-btn' value='Extraire les notes'/>");
      let btnArea = document.querySelector('#kp-notebook-head');
      btnArea.appendChild(btnFragment);


      document.getElementById("extract-to-md-btn").addEventListener("click", extractKindleNotes); 
    }
  
  
  	function extractKindleNotes(){
      console.log("Kindle notes extractor : extract Kindle Notes");
      
			var txtOutput = '';
      
      var notes = document.getElementById('kp-notebook-annotations').getElementsByClassName("kp-notebook-row-separator");
      
      Array.from(notes).forEach((note) => {
        
        var highlight = getHighlight(note);
        var location = getLocation(note);
        var noteTxt = getNote(note);
        
        
        if(noteTxt){
          txtOutput += "\n- " + noteTxt;
          if(location){
          	txtOutput += "*(Loc kindle: "+location+')*';
	        }
        }
        if(highlight){
          txtOutput += "\n- > " + highlight.replace("\n","\n> ");
          if(location){
          	txtOutput += " *(Loc kindle: "+location+')*';
	        }
        }
        
			});
      
      outputText(txtOutput);
      
		}


  	function getLocation(note){
      
	  	var node = note.querySelector('#annotationHighlightHeader');
      if(node){
        //console.log(node.textContent);
        //var rx = /Location: (\d*)/;
        //var loc = rx.exec(node.textContent);
        var loc = /Location:\s*([\d,]*)/g.exec(node.textContent);
        console.dir(loc);
        if(loc.length > 0){
          return loc[1].replace(',','');
        }
      }

      return '';
    }
  
  	function getHighlight(note){
      var node = note.querySelector("#highlight");
      
      if(node){
        return node.textContent;
      }
      return '';
    }

  	function getNote(note){
      var node = note.querySelector("#note");
      if(node){
        return node.textContent;
      }
      return '';
    }

  	function outputText(txt){

      var txta = document.querySelector('#extract-to-md-output');
     	if(!txta){
				txta = document.createElement('textarea');
	      txta.setAttribute("id", "extract-to-md-output");
        document.querySelector('#kp-notebook-head').appendChild(txta);
      }
      txta.value = txt;
      
    } 
  

  	setTimeout(() => {  initKindleExtractor(); }, 1000);
  
})();
