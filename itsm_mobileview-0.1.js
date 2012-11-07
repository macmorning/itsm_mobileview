/*
*	Copyright (C) 2013
*	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;ITSM_MOBILEVIEW = {
	name: 'ITSM_MOBILEVIEW',
	context: '/arsys',
	incidentFields: {
				number : "ns0\\:Incident_Number",
				status : "ns0\\:Status",
				statusReason : "ns0\\:Status_Reason",
				serviceType : "ns0\\:Service_Type",
				assignedSGCompany : "ns0\\:Assigned_Support_Company",
				assignedSGOrganization : "ns0\\:Assigned_Support_Organization",
				assignedSG : "ns0\\:Assigned_Group",
				summary : "ns0\\:Summary",
				priority : "ns0\\:Priority",
				categorization1 : "ns0\\:Categorization_Tier_1",
				categorization2 : "ns0\\:Categorization_Tier_2",
				categorization3 : "ns0\\:Categorization_Tier_3",
				firstName : "ns0\\:First_Name",
				lastName : "ns0\\:Last_Name",
				vip : "ns0\\:VIP",
				phone : "ns0\\:Phone_Number",
				email : "ns0\\:Internet_E-mail",
				region : "ns0\\:Region",
				site : "ns0\\:Site",
				reportedDate : "ns0\\:Reported_Date",
				submitDate : "ns0\\:Submit_Date"		
	},
	callService: function(credentials,service,successFn,errorFn)
	/* callService : calls a service from the MOB:UserCentral AR System web service [RefreshCounters|Connect]
			credentials : array
				"username" : Remedy login name
				"password" : AR System password, as it would be typed on MT login page (either for external authentication or not)
				"server" : the server name as appearing in MT configuration page
			service : service name
			successFn : handler for the "success" ajax event, called with the xml text of the response
			errorFn : handler for the "error" ajax event, called with the xml text of the response
	*/
	{
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] callService - service ' + service);
		var wsURL = ITSM_MOBILEVIEW.context + '/services/ARService?server=' + credentials.server + '&webService=MOB:UserCentral';
		// soap message for getList operations always have this structure
		var soapMessage ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:MOB:UserCentral">\
						   <soapenv:Header>\
							  <urn:AuthenticationInfo>\
								 <urn:userName>' + credentials.username + '</urn:userName>\
								 <urn:password>' + credentials.password + '</urn:password>\
							  </urn:AuthenticationInfo>\
						   </soapenv:Header>\
						   <soapenv:Body>\
							  <urn:' + service + '>\
								 <urn:z1D_serviceName>' + service + '</urn:z1D_serviceName>\
							  </urn:' + service + '>\
						   </soapenv:Body>\
						</soapenv:Envelope>';
		var jqxhr = $.ajax({
			url: wsURL,
			beforeSend: function( xhr ){
					xhr.setRequestHeader(
					"SOAPAction",
					"POST"
					);
			},
			type: "POST",
			dataType: "xml",
			data: soapMessage,
			contentType: "text/xml; charset=\"utf-8\"",				
			success: function(xml){
				console.log(ITSM_MOBILEVIEW.name + ' [INFO]   ...success');
				successFn(xml);
				return true;},
			error: function(xml,status,error){
				console.log(ITSM_MOBILEVIEW.name + ' [ERROR]   ...error (' + error + ')');
				errorFn(xml.responseXML);
				return false;}
		});
		return false;
	},
	getList: function(credentials,webservice,operation,qualification,successFn,errorFn)
	/* getList : calls an ITSM "get list" operation
			credentials : array
				"username" : Remedy login name
				"password" : AR System password, as it would be typed on MT login page (either for external authentication or not)
				"server" : the server name as appearing in MT configuration page
			webservice : webservice name, as appears in devStudio and WSDL
			operation : operation name, as appears in devStudio and WSDL
			qualification : qualification for the query, example : '\'Assignee Login ID\'="' + CONTEXT.credentials.username + '" AND \'Status\'&lt;5'
			successFn : handler for the "success" ajax event, called with the xml text of the response
			errorFn : handler for the "error" ajax event, called with the xml text of the response
	*/
	{
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] getList - operation ' + operation);
		$.mobile.loading('show');
		// need to parameterize target location url ?
		var wsURL = ITSM_MOBILEVIEW.context + '/services/ARService?server=' + credentials.server + '&webService=' + webservice;
		// soap message for getList operations always have this structure
		var soapMessage ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:' + webservice + '">\
						   <soapenv:Header>\
							  <urn:AuthenticationInfo>\
								 <urn:userName>' + credentials.username + '</urn:userName>\
								 <urn:password>' + credentials.password + '</urn:password>\
							  </urn:AuthenticationInfo>\
						   </soapenv:Header>\
						   <soapenv:Body>\
							  <urn:' + operation + '>\
								 <urn:Qualification>' + qualification + '</urn:Qualification>\
								 <urn:startRecord>0</urn:startRecord>\
								 <urn:maxLimit>50</urn:maxLimit>\
							  </urn:' + operation + '>\
						   </soapenv:Body>\
						</soapenv:Envelope>';
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] getList - posting request ...');
		var jqxhr = $.ajax({
			url: wsURL,
			beforeSend: function( xhr ){
					xhr.setRequestHeader(
					"SOAPAction",
					"POST"
					);
			},
			type: "POST",
			dataType: "xml",
			data: soapMessage,
			contentType: "text/xml; charset=\"utf-8\"",
			success: function(xml){
				console.log(ITSM_MOBILEVIEW.name + ' [INFO]   ...success');
				successFn(xml);},
			error: function(xml,status,error){
				console.log(ITSM_MOBILEVIEW.name + ' [ERROR]   ...error (' + error + ')');
				errorFn(xml.responseXML);
				return false;
			}
		});
		return false;
	},
	extractUserInfo: function(xml) {
		var userinfo;
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] extractUserInfo');
		$(xml).find("ns0\\:ConnectResponse").each(function()
		{
			userinfo = {
				fullname: $(this).find("ns0\\:fullName").text(),
				license_type: $(this).find("ns0\\:licenseType").text(),
				email: $(this).find("ns0\\:emailAddress").text(),
				groups: $(this).find("ns0\\:groupList").text()
			};
			console.log(ITSM_MOBILEVIEW.name + ' [INFO]   found user ' + userinfo.fullname);
		});
		return userinfo;
	},
	extractCounters: function(xml) {
		var counters;
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] extractCounters');
		$(xml).find("ns0\\:ConnectResponse").each(function()
		{
			counters = {
				countIncidents: $(this).find("ns0\\:countIncidents").text(),
				countChanges: $(this).find("ns0\\:countChanges").text(),
				countTasks: $(this).find("ns0\\:countTasks").text(),
				countApprovals: $(this).find("ns0\\:countSignatures").text()
			};
			console.log(ITSM_MOBILEVIEW.name + ' [INFO]   found counters ' 
				+ counters.countIncidents + "/" 
				+ counters.countChanges + "/" 
				+ counters.countTasks + "/" 
				+ counters.countApprovals);
		});
		return counters;
	},
	extractError: function(xml) {
		var error={};
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] handleError');
		$(xml).find("soapenv\\:Fault").each(function()
		{
			error = {
				code: $(this).find("faultcode").text(),
				message: $(this).find("faultstring").text()
				};
			console.log(ITSM_MOBILEVIEW.name + ' [INFO]    ' + error.message);
		});
		return error;		
	},
	extractIncidents: function(xml) {
		var incidents = {};
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] extractIncidents');
		$(xml).find("ns0\\:getListValues").each(function()
		{
			var id = $(this).find(ITSM_MOBILEVIEW.incidentFields.number).text(); // get the incident number; will be used as a key for the incidents array
			incidents[id] = ITSM_MOBILEVIEW.extractIncidentFields($(this));
		});
		return incidents;
	},
	extractIncidentFields: function(xml) {
		var incident = {};
		$.each(ITSM_MOBILEVIEW.incidentFields, function(key,value) {
			incident[key] = xml.find(value).text();
		});	
		return incident;
	}
}
if ( ! window.console ) console = { log: function(){} };
console.log(ITSM_MOBILEVIEW.name + ' [INFO] namespace loaded');
console.log(ITSM_MOBILEVIEW.name + ' [INFO]  context = ' + ITSM_MOBILEVIEW.context);