// ==UserScript==
// @name Kindle notes extractor
// @version 1.0.1
// @description Extract notes from kindle to markdown format suitable for Obsidian.
// @author Yann Charlou
// @grant none
// @include https://read.amazon.com/notebook/*
// @include https://read.amazon.com/notebook?*
// @include https://read.amazon.com/notebook
// @updateURL https://raw.githubusercontent.com/yanncharlou/GreaseMonkeyKindleNotesExtractor/main/GreaseMonkey-kindle-notes-extractor.user.js
// @downloadURL https://raw.githubusercontent.com/yanncharlou/GreaseMonkeyKindleNotesExtractor/main/GreaseMonkey-kindle-notes-extractor.user.js
// ==/UserScript==

(function() {
    'use strict';
  
  	console.log("Kindle notes extractor : start");
  
  	function initKindleExtractor(){

      var range = document.createRange();
      var btnFragment = range.createContextualFragment("<input type='button' id='extract-to-md-btn' value='Extraire les notes'/>");
      let btnArea = document.querySelector('#kp-notebook-head');
      btnArea.appendChild(btnFragment);


      document.getElementById("extract-to-md-btn").addEventListener("click", extractKindleNotes); 
      
      console.log("Kindle notes extractor : launched");

    }
  
  
  	function extractKindleNotes(){
      console.log("Kindle notes extractor : extract Kindle Notes");
      
			var txtOutput = '';
      
      var notes = document.getElementById('kp-notebook-annotations').getElementsByClassName("kp-notebook-row-separator");
      
      Array.from(notes).forEach((note) => {
        
        var highlight = getHighlight(note);
        var location = getLocation(note);
        var noteTxt = getNote(note);
        var link = getMDLinkToNote(note);
        
        
        if(noteTxt){
          txtOutput += "\n- " + noteTxt;
          if(link){
            txtOutput += link;
          }
        }
        if(highlight){
          txtOutput += "\n- > " + highlight.replace("\n","\n> ");
          if(link){
            txtOutput += link;
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
  
  	function getBookASIN(){
      let asinInput = document.getElementById('kp-notebook-annotations-asin');
      if(asinInput){
        return asinInput.value;
      }
      return false;
    }
  
  	function getMDLinkToNote(note){
      let url = getDirectUrlToNote(note);
      let loc = getLocation(note);

      if(url && loc){
        return ' [kindle loc '+ loc +']('+ url +')';
      }
      return '';
    }
  
  	function getDirectUrlToNote(note){
      let location = getLocation(note);
      let asin = getBookASIN();
      return 'kindle://book?action=open&asin='+ asin +'&location=' + location;
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



