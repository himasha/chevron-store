/*
 *  Copyright (c) 2005-2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
$(document).ready(function()
{
   chevronProperties = []; //store properties of each chevron
   var processId = 0;

   $("#viewMainProps").show();
   $("#viewElementProps").hide();

   // ajax call to get the process name the view belongs to
   $.ajax(
   {
      type: "GET",
      url: "/store/asts/chevron/apis/nameStore",
      data:
      {
         type: "GET"
      },
      success: function(result)
      {
         getXmlForProcess(result);
      }
   });

   $('#canvasArea').dblclick(function(e)
   {
      $("#viewMainProps").show();
      $("#viewElementProps").hide();

   });

   //function to get the specific xml content for the given process
   function getXmlForProcess(process)
   {

      $.ajax(
      {
         type: "GET",
         url: "/store/asts/chevron/apis/chevronxml",
         data:
         {
            type: "GET",
            name: process
         },
         success: function(xmlResult)
         {

            drawDiagramOnCanvas(xmlResult);
         }
      });
   }

   //function to draw retrived chevron content to canvas
   function drawDiagramOnCanvas(xmlResult)
   {

      var test = xmlResult;
      test = test.replace(/&quot;/g, '"');
      test = test.split(',');

      var jsonobj = eval("(" + test + ")");

      // get length of elements  array
      var numberOfElements = jsonobj.xmlSection[0].chevrons[0].element.length;

      //draw elements 
      for (var i = 0; i < numberOfElements; i++)
      {
         var chevronId = jsonobj.xmlSection[0].chevrons[0].element[i].chevronId;
         var chevronName = jsonobj.xmlSection[0].chevrons[0].element[i].chevronName;
         var positionX = jsonobj.xmlSection[0].styles[0].format[i].X;
         var positionY = jsonobj.xmlSection[0].styles[0].format[i].Y;
         var process = jsonobj.xmlSection[0].chevrons[0].element[i].associatedAsset;

         storePropertiesOfChevron(chevronId, chevronName, process);

         var element1 = $('<div>').attr('id', 'chevronId').addClass('chevron');

         var textField = $('<textArea>').attr(
         {
            name: chevronId
         }).addClass("chevron-textField");

         textField.val(chevronName);
         element1.append(textField);

         element1.find('.chevron-text').position(
         { // position text box in the center of element
            my: "center",
            at: "center",
            of: element1
         });

         element1.css(
         {
            'top': positionY,
            'left': positionX

         });
         $('#canvasArea').append(element1);

         element1.click(chevronClicked);
      }

   }

   function replaceProcessText(processName)
   {
      $.ajax(
      {
         type: "GET",
         url: "../apis/processes?type=process",
         data:
         {
            q: processName
         },
         success: function(Result)
         {

            setIdOfProcess(Result, processName);
         }
      });
   }

   function setIdOfProcess(results, processName)
   {

      var obj = eval("(" + results + ")");
      for (var i in obj)
      {
         var item = obj[i];
         // alert(item.id);
         processId = item.id;

      }

      $("#td_mod").append('<li><a href = https://localhost:9443/publisher/asts/process/details/' + processId + '>' + processModel + '</a></li>');
   }

   function storePropertiesOfChevron(id, name, process)
   {

      if (process == '' || process == null)
      {

         process = "None";
      }
      chevronProperties.push(
      {
         id: id,
         name: name,
         process: process

      });
   }

   function chevronClicked()
   {
      $("#td_mod").html("");
      // alert('got here');
      $("#viewElementProps").show();

      var clickedElement = $(this);
      var id = clickedElement.find('.chevron-textField').attr('name');
      $("#viewMainProps").hide();
      for (i = 0; i < chevronProperties.length; i++)
      {

         if (id == chevronProperties[i].id)
         {
            name = chevronProperties[i].name;
            processModel = chevronProperties[i].process;
            $("#td_name1").html(name);

            if (processModel !== "None")
            {
               // set id and name of process as a link
               replaceProcessText(processModel);
            }
            else
            {
               $("#td_mod").html("None");
            }

         }

      }
   }

});