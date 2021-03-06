jQuery.sap.require("cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S4Custom", {
	departmentf4open: "",
	zzModuleIdf4open: "",
	OppTypef4open: "",
	onInit: function() {
		//Execute onInit for the base class BaseMasterController  
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// department F4
		this.departmentF4Template = new sap.m.StandardListItem({
			title: "{DepartmentId}",
			description: "{parts:[{path : 'NameOrg1'},{path : 'NameOrg2'},{path : 'NameFirst'},{path : 'NameLast'},{path : 'NameLast2'}],formatter : 'cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter.getDepartmentDesc'}",
			active: true
		});
		this.departmentF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.departmentF4Template.data("ID", "{DepartmentId}");
		// HE Module Type F4
		this.zzModuleIdF4Template = new sap.m.StandardListItem({
			title: "{ZmoduleId}",
			description: "{ZmoduleName}",
			active: true
		});
		this.zzModuleIdF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.zzModuleIdF4Template.data("ID", "{ZmoduleId}");
		// HE opportunity Type F4
		this.OppTypeF4Template = new sap.m.StandardListItem({
			title: "{Description}",
			description: "{Type}",
			active: true
		});
		this.OppTypeF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.OppTypeF4Template.data("ID", "{Type}");
		// do something after the items loaded
        var that = this;
        this.oModel.attachRequestCompleted(function(){
			that._onAfterRequestComp();
        });
	},
    _onAfterRequestComp: function() {
        this.convertCustOppType();
        this.convertModuleName();
        this.convertDepartmentName();
	},
	
	/* Forecast Discount/sell through - validation*/
	validatezPercentageField: function(oControlEvent) {
		if (oControlEvent.getParameters().value > 100) {
			sap.m.MessageBox.alert("Percentage field - therefore the maximum value is 100");
			this.byId(oControlEvent.getSource().sId).setValue(100);
		}
	},
	
	convertCustOppType: function(vInputType) {
	    var vOppTypeID;
	    if(typeof vInputType !== "undefined" && vInputType !== "" && this.isCustNumeric(vInputType)) {
	        vOppTypeID = vInputType;
	    } else {
	        vOppTypeID = this.byId('idzzOppType_e').mProperties.text;
	    }
	    if(vOppTypeID !== "" && this.isCustNumeric(vOppTypeID)) {
		    var sPathOppType = "/ZOpportunityTypeHESet('" + vOppTypeID + "')";
		    var that = this;
		    this.oModel.read(sPathOppType, null, null, true, function(oData) {
    			if (oData && typeof oData !== "undefined" && oData.Description !== "") {
    				that.byId('idzzOppType_e').setValue(oData.Description);
    				that.activeCustOppTypeID = oData.Type;
    			}
    		}, function(oError) {
    			console.log("oData Request Error:" + sPathOppType + " Error: " + oError);
    		});
        }
	},
	convertModuleName: function(vInputType) {
	    var vModuleID;
	    if(typeof vInputType !== "undefined" && vInputType !== "" && this.isCustNumeric(vInputType)) {
	        vModuleID = vInputType;
	    } else {
	        vModuleID = this.byId('idzzModuleId_e').mProperties.text;
	    }
	    if(vModuleID !== "" && this.isCustNumeric(vModuleID)) {
		    var sPathModule = "/ZModuleCollection('" + vModuleID + "')";
		    var that = this;
		    this.oModel.read(sPathModule, null, ["$select=ZmoduleId,ZmoduleName"], true, function(oData) {
    			if (oData && typeof oData !== "undefined" && oData.ZmoduleName !== "") {
    				that.byId('idzzModuleId_e').setValue(oData.ZmoduleName);
    				that.activeModuleID = oData.ZmoduleId;
    			}
    		}, function(oError) {
    			console.log("oData Request Error:" + sPathModule + " Error: " + oError);
    		});
        }
	},
	convertDepartmentName: function(vInputType) {
	    var vDepartmentID;
	    if(typeof vInputType !== "undefined" && vInputType !== "" && this.isCustNumeric(vInputType)) {
	        vDepartmentID = vInputType;
	    } else {
	        vDepartmentID = this.byId('idZzDepartment_e').mProperties.text;
	    }
	    if(vDepartmentID !== "" && this.isCustNumeric(vDepartmentID)) {
		    var sPathDepartment = "/ZDepartmentSet('" + vDepartmentID + "')";
		    var that = this;
		    this.oModel.read(sPathDepartment, null, null, true, function(oData) {
    			if (oData && typeof oData !== "undefined") {
    				var depName = cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter.getDepartmentDesc(oData.NameOrg1,oData.NameOrg2,oData.NameFirst,oData.NameLast,oData.NameLast2);
    				if ( depName !== "" ) {
    					that.byId('idZzDepartment_e').setValue(depName);
    					that.activeDepartmentID = oData.DepartmentId;
    				}
    			}
    		}, function(oError) {
    			console.log("oData Request Error:" + sPathDepartment + " Error: " + oError);
    		});
        }
	},
	isCustNumeric: function( obj ) {
	    if ( typeof obj === "undefined") {
	        return false;
	    }
        return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
    },
	extHookAddCustomHeaderFields: function(oCustomEntry) {
		// additional value - ZzfcDiscount
		var extensionZzfcDiscountValue = this.byId("idZzfcDiscount_e").getValue();
		oCustomEntry.ZzfcDiscount = extensionZzfcDiscountValue;
		// additional value - ZzfcSellThr
		var extensionZzfcSellThrValue = this.byId("idZzfcSellThr_e").getValue();
		oCustomEntry.ZzfcSellThr = extensionZzfcSellThrValue;
		// additional value - ZzfcOppEnroll
		var extensionZzfcOppEnrollValue = this.byId("idZzfcOppEnroll_e").getValue();
		oCustomEntry.ZzfcOppEnroll = extensionZzfcOppEnrollValue;
		// additional value - zzModuleId
		var extensionzzModuleIdValue = this.byId("idzzModuleId_e").getValue();
		if (typeof this.activeModuleID !== "undefined" && this.activeModuleID !== "") {
		    oCustomEntry.zzModuleId = this.activeModuleID;
		} else if (this.isCustNumeric(extensionzzModuleIdValue)) {
			oCustomEntry.zzModuleId = extensionzzModuleIdValue;
		}
		// additional value - ZzDepartment
		var extensionZzDepartmentValue = this.byId("idZzDepartment_e").getValue();
		if (typeof this.activeDepartmentID !== "undefined" && this.activeDepartmentID !== "") {
		    oCustomEntry.ZzDepartment = this.activeDepartmentID;
		} else if (this.isCustNumeric(extensionZzDepartmentValue)) {
			oCustomEntry.ZzDepartment = extensionZzDepartmentValue;
		}
		// additional value - zzOppType
		var extensionzzOppTypeValue = this.byId("idzzOppType_e").getValue();
		if (typeof this.activeCustOppTypeID !== "undefined" && this.activeCustOppTypeID !== "") {
		    oCustomEntry.zzOppType = this.activeCustOppTypeID;
		} else if (this.isCustNumeric(extensionzzOppTypeValue)) {
		    oCustomEntry.zzOppType = extensionzzOppTypeValue;
		}
		this.zoCustomEntry = oCustomEntry;
		return true;
	},
	extHookHandleResponsesForCustomUpdates: function(r) {
		// Place your hook implementation code here
		if( typeof this.zoCustomEntry !== "undefined" && this.zoCustomEntry.ZzDepartment !== "" && this.zoCustomEntry.ZzDepartment !== this.HeaderObject.ZzDepartment ) {
    		// delete the old
    		if( this.HeaderObject.ZzDepartment !== "" ) {
    		    var vServiceUrl = "/OpportunitySalesTeamSet(PartnerNumber='" + this.HeaderObject.ZzDepartment + "',PartnerFunctionCode='00000033',HeaderGuid=guid'" + this.HeaderObject.Guid + "')";
    		    this.oModel.remove(vServiceUrl,null, null, null);
    		}
    		// create the new
    		var vDepartment = {
    			HeaderGuid: this.zoCustomEntry.Guid,
    			PartnerFunctionCode: "00000033",
    			PartnerNumber: this.zoCustomEntry.ZzDepartment,
    			PartnerName: "Is Department",
    			PartnerFunctionText: "Is Department"
    		};
    		vServiceUrl = "/OpportunitySalesTeamSet";
    		this.oModel.create(vServiceUrl, vDepartment, null, null, null);
		}
	},
	extHookBindAdditionalFields: function(a) {
		// get the details for this edit page
		var oDataDetails = a.byId("info").getModel("json").getData();
		// set the values
		this.byId("idZzfcDiscount_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcDiscount));
		this.byId("idZzfcSellThr_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcSellThr));
		this.byId("idZzfcOppEnroll_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcOppEnroll));
		this.byId("idzzModuleId_e").setValue(oDataDetails.zzModuleId);
		this.byId("idZzDepartment_e").setValue(oDataDetails.ZzDepartment);
		this.byId("idzzOppType_e").setValue(oDataDetails.zzOppType);
		if (this.isCustNumeric(oDataDetails.zzOppType)) {
		    this.activeCustOppTypeID = oDataDetails.zzOppType;
		}
		if (this.isCustNumeric(oDataDetails.zzModuleId)) {
		    this.activeModuleID = oDataDetails.zzModuleId;
		}
		if (this.isCustNumeric(oDataDetails.ZzDepartment)) {
		    this.activeDepartmentID = oDataDetails.ZzDepartment;
		}
        this.convertCustOppType(oDataDetails.zzOppType);
        this.convertModuleName(oDataDetails.zzModuleId);
        this.convertDepartmentName(oDataDetails.ZzDepartment);
	},

	/* Department F4 Dialog methods */
	_setDepartmentF4Text: function(e) {
		if (this._departmentSelectDialog) {
			this._departmentSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setValue(this.byId("idZzDepartment_e").getValue());
			this._departmentSelectDialog.getModel().detachRequestCompleted(this._setDepartmentF4Text, this);
		}
	},
	showDepartmentF4: function(e) {
		if (typeof this.HeaderObject.ProspectNumber === "undefined" || this.HeaderObject.ProspectNumber === null || this.HeaderObject.ProspectNumber ===
			"") {
			sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL"));
			return;
		}
		if (!this._departmentSelectDialog) {
			this._departmentSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZDepartmentSelectDialog", this);
			this._departmentSelectDialog.setModel(this.getView().getModel());
			this._departmentSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._departmentSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._departmentSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingScrollToLoad(true);
			this._departmentSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._departmentSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_DEPARTMENT_TEXT"));
				}
			}, this._departmentSelectDialog);
			this._departmentSelectDialog.getAggregation("_dialog").setVerticalScrolling(true);
		}
		this._departmentSelectDialog.getModel().attachRequestCompleted(null, this._setDepartmentF4Text, this);
		var f = [];
		f.push(new sap.ui.model.Filter("LinkedBp", sap.ui.model.FilterOperator.EQ, this.HeaderObject.ProspectNumber));
		this._departmentSelectDialog.getAggregation("_dialog").getContent()[1].bindAggregation("items", {
			path: "/ZDepartmentSet",
			filters: f,
			template: this.departmentF4Template
		});
		this._departmentSelectDialog.open();
	},
	closeDepartmentF4: function(e) {
		this.byId("dialogDepartmentF4").close();
		this.departmentf4open = "";
	},
	setDepartment: function(e) {
		var params = e.getParameter("selectedItem");
		var idDepartment = params.data("ID");
		this.byId("idZzDepartment_e").setValue(idDepartment);
        this.convertDepartmentName(idDepartment);
	},
	searchDepartment: function(e) {
		if (typeof this.HeaderObject.ProspectNumber === "undefined" || this.HeaderObject.ProspectNumber === null || this.HeaderObject.ProspectNumber ===
			"") {
			sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL"));
			return;
		}
		var f = [];
		f.push(new sap.ui.model.Filter("LinkedBp", sap.ui.model.FilterOperator.EQ, this.HeaderObject.ProspectNumber));
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter("NameOrg1", sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	},
	/* HE Module Type F4 Dialog methods */
	_setzzModuleIdF4Text: function(e) {
		if (this._zzModuleIdSelectDialog) {
			this._zzModuleIdSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setValue(this.byId("idzzModuleId_e").getValue());
			this._zzModuleIdSelectDialog.getModel().detachRequestCompleted(this._setzzModuleIdF4Text, this);
		}
	},
	showzzModuleIdF4: function(e) {
		if (!this._zzModuleIdSelectDialog) {
			this._zzModuleIdSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZModuleSelectDialog", this);
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel());
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._zzModuleIdSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._zzModuleIdSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingScrollToLoad(true);
			this._zzModuleIdSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._zzModuleIdSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_ZMODULE_TEXT"));
				}
			}, this._zzModuleIdSelectDialog);
			this._zzModuleIdSelectDialog.getAggregation("_dialog").setVerticalScrolling(true);
		}
		this._zzModuleIdSelectDialog.getModel().attachRequestCompleted(null, this._setzzModuleIdF4Text, this);
		var f = [];
		this._zzModuleIdSelectDialog.getAggregation("_dialog").getContent()[1].bindAggregation("items", {
			//path: "/ZModuleCollection",
			path: "/AccountCollection('" + this.HeaderObject.ProspectNumber + "')/ZModules",
			parameters: {
				select: "ZmoduleId,ZmoduleName"
			},
			filters: f,
			template: this.zzModuleIdF4Template
		});
		this._zzModuleIdSelectDialog.open();
	},
	closezzModuleIdF4: function(e) {
		this.byId("dialogzzModuleIdF4").close();
		this.zzModuleIdf4open = "";
	},
	setzzModuleId: function(e) {
		var params = e.getParameter("selectedItem");
		var idzzModuleId = params.data("ID");
		this.byId("idzzModuleId_e").setValue(idzzModuleId);
        this.convertModuleName(idzzModuleId);
	},
	searchzzModuleId: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter("ZmoduleName", sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	},
	/* HE Opportunity Type F4 Dialog methods */
	_setOppTypeF4Text: function(e) {
		if (this._OppTypeSelectDialog) {
			this._OppTypeSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setValue(this.byId("idzzOppType_e").getValue());
			this._OppTypeSelectDialog.getModel().detachRequestCompleted(this._setOppTypeF4Text, this);
		}
	},
	showOppTypeF4: function(e) {
		if (!this._OppTypeSelectDialog) {
			this._OppTypeSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZOppTypeSelectDialog", this);
			this._OppTypeSelectDialog.setModel(this.getView().getModel());
			this._OppTypeSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._OppTypeSelectDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._OppTypeSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingScrollToLoad(true);
			this._OppTypeSelectDialog.getAggregation("_dialog").getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._OppTypeSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_OPPTYPE_TEXT"));
				}
			}, this._OppTypeSelectDialog);
			this._OppTypeSelectDialog.getAggregation("_dialog").setVerticalScrolling(true);
		}
		this._OppTypeSelectDialog.getModel().attachRequestCompleted(null, this._setOppTypeF4Text, this);
		var f = [];
		this._OppTypeSelectDialog.getAggregation("_dialog").getContent()[1].bindAggregation("items", {
			path: "/ZOpportunityTypeHESet",
			filters: f,
			template: this.OppTypeF4Template
		});
		this._OppTypeSelectDialog.open();
	},
	closeOppTypeF4: function(e) {
		this.byId("dialogOppTypeF4").close();
		this.OppTypef4open = "";
	},
	setOppType: function(e) {
		var params = e.getParameter("selectedItem");
		var idOppType = params.data("ID");
		this.byId("idzzOppType_e").setValue(idOppType);
        this.convertCustOppType(idOppType);
	},
	searchOppType: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	}
});