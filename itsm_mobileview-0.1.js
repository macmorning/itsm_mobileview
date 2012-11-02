/*
*	Copyright (C) 2013 Sylvain YVON
*	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;ITSM_MOBILEVIEW = {
	name: 'ITSM_MOBILEVIEW',
	context: '/arsys',
	callService: function(credentials,service,successFn,errorFn)
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
								 <urn:z1D_serviceName>' + service + '</urn:Qualification>\
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
				successFn(xml);},
			error: function(error){
				console.log(ITSM_MOBILEVIEW.name + ' [ERROR]   ...error!');
				errorFn(error);}
		});
		return false;
	},
	getList: function(credentials,webservice,operation,qualification,successFn,errorFn)
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
			error: function(error){
				console.log(ITSM_MOBILEVIEW.name + ' [ERROR]   ...error!');
				errorFn(error);}
		});
		return false;
	},
	extractUserInfo: function(xml) {
		var userinfo;
		console.log(ITSM_MOBILEVIEW.name + ' [INFO] extractUserInfo');
		$(xml).find("ns0\\:getListValues").each(function()
		{
			userinfo = {
				fullname: $(this).find("ns0\\:Full_Name").text(),
				license_type: $(this).find("ns0\\:License_Type").text(),
				email: $(this).find("ns0\\:Email_Address").text(),
				groupids: $(this).find("ns0\\:Group_List").text()
			};
			console.log(ITSM_MOBILEVIEW.name + ' [INFO]   found user ' + userinfo.fullname);
		});
		return userinfo;
	}
}
console.log(ITSM_MOBILEVIEW.name + ' [INFO] namespace loaded');
console.log(ITSM_MOBILEVIEW.name + ' [INFO]  context = ' + ITSM_MOBILEVIEW.context);