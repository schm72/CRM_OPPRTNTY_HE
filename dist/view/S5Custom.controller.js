jQuery.sap.require("cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S5Custom", {
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
	convertCustOppType: function(vInputType) {
	    var vOppTypeID;
	    if(typeof vInputType !== "undefined" && vInputType !== "" && this.isCustNumeric(vInputType)) {
	        vOppTypeID = vInputType;
	    } else {
	        vOppTypeID = this.byId('idzzOppType').mProperties.text;
	    }
	    if(vOppTypeID !== "" && this.isCustNumeric(vOppTypeID)) {
		    var sPathOppType = "/ZOpportunityTypeHESet('" + vOppTypeID + "')";
		    var that = this;
		    this.oModel.read(sPathOppType, null, null, true, function(oData) {
    			if (oData && typeof oData !== "undefined" && oData.Description !== "") {
    				that.byId('idzzOppType').setValue(oData.Description);
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
	        vModuleID = this.byId('idzzModuleId').mProperties.text;
	    }
	    if(vModuleID !== "" && this.isCustNumeric(vModuleID)) {
		    var sPathModule = "/ZModuleCollection('" + vModuleID + "')";
		    var that = this;
		    this.oModel.read(sPathModule, null, ["$select=ZmoduleId,ZmoduleName"], true, function(oData) {
    			if (oData && typeof oData !== "undefined" && oData.ZmoduleName !== "") {
    				that.byId('idzzModuleId').setValue(oData.ZmoduleName);
    				that.activeModuleID = oData.ZmoduleId;
    			}
    		}, function(oError) {
    			console.log("oData Request Error:" + sPathModule + " Error: " + oError);
    		});
        }
	},
	convertDepartmentName: function(vInputType) {
		console.log(this.byId('idZzDepartment'));
	    var vDepartmentID;
	    if(typeof vInputType !== "undefined" && vInputType !== "" && this.isCustNumeric(vInputType)) {
	        vDepartmentID = vInputType;
	    } else {
	        vDepartmentID = this.byId('idZzDepartment').mProperties.text;
	    }
	    if(vDepartmentID !== "" && this.isCustNumeric(vDepartmentID)) {
		    var sPathDepartment = "/ZDepartmentSet('" + vDepartmentID + "')";
		    var that = this;
		    this.oModel.read(sPathDepartment, null, null, true, function(oData) {
    			if (oData && typeof oData !== "undefined") {
    				var depName = cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter.getDepartmentDesc(oData.NameOrg1,oData.NameOrg2,oData.NameFirst,oData.NameLast,oData.NameLast2);
    				if ( depName !== "" ) {
    					that.byId('idZzDepartment').setValue(depName);
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
	extHookSaveOentry: function(oEntry) {
		var oExtensionZzfcDiscount = this.byId("idZzfcDiscount");
		var valueZzfcDiscount = oExtensionZzfcDiscount.getValue();
		oEntry.ZzfcDiscount = valueZzfcDiscount;
		
		var oExtensionZzfcSellThr = this.byId("idZzfcSellThr");
		var valueZzfcSellThr = oExtensionZzfcSellThr.getValue();
		oEntry.ZzfcSellThr = valueZzfcSellThr;
		
		var oExtensionZzfcOppEnroll = this.byId("idZzfcOppEnroll");
		var valueZzfcOppEnroll = oExtensionZzfcOppEnroll.getValue();
		oEntry.ZzfcOppEnroll = valueZzfcOppEnroll;
		
		var oExtensionzzModuleId = this.byId("idzzModuleId");
		var valuezzModuleId = oExtensionzzModuleId.getValue();
		if (typeof this.activeModuleID !== "undefined" && this.activeModuleID !== "") {
		    oEntry.zzModuleId = this.activeModuleID;
		} else if (this.isCustNumeric(valuezzModuleId)) {
		    oEntry.zzModuleId = valuezzModuleId;
		}
		
		var oExtensionZzDepartment = this.byId("idZzDepartment");
		var valueZzDepartment = oExtensionZzDepartment.getValue();
		if (typeof this.activeDepartmentID !== "undefined" && this.activeDepartmentID !== "") {
		    oEntry.ZzDepartment = this.activeDepartmentID;
		} else if (this.isCustNumeric(valueZzDepartment)) {
			oEntry.ZzDepartment = valueZzDepartment;
		}
		
		var oExtensionzzOppType = this.byId("idzzOppType");
		var valuezzOppType = oExtensionzzOppType.getValue();
		if (typeof this.activeCustOppTypeID !== "undefined" && this.activeCustOppTypeID !== "") {
		    oEntry.zzOppType = this.activeCustOppTypeID;
		} else if (this.isCustNumeric(valuezzOppType)) {
		    oEntry.zzOppType = valuezzOppType;
		}
        if( oEntry.ZzDepartment !== "" ) {
    		var vDepartment = {
    			HeaderGuid: oEntry.Guid,
    			PartnerFunctionCode: "00000033",
    			PartnerNumber: oEntry.ZzDepartment,
    			PartnerName: "Is Department",
    			PartnerFunctionText: "Is Department"
    		};
    		oEntry.SalesTeam.push(vDepartment);
        }
	},
	extHookCustomLogicForAttachRouteMatch: function(e) {
		this.getView().addEventDelegate({
			onAfterShow: jQuery.proxy(function(evt) {
				this.onAfterShowOppExt(evt);
			}, this)
		});
	},
	onAfterShowOppExt: function(e) {
		this.byId("idZzfcDiscount").setValue("");
		this.byId("idZzfcSellThr").setValue("");
		this.byId("idZzfcOppEnroll").setValue("");
		this.byId("idzzModuleId").setValue("");
		this.byId("idZzDepartment").setValue("");
		// default -> 11
		var vDefaultValue = "11";
		this.byId('idzzOppType').setValue(vDefaultValue);
		if (this.isCustNumeric(vDefaultValue)) {
		    this.activeCustOppTypeID = vDefaultValue;
		}
        this.convertCustOppType(vDefaultValue);
	},

	/* Forecast Discount/sell through - validation*/
	validatezPercentageField: function(oControlEvent) {
		if (oControlEvent.getParameters().value > 100) {
			sap.m.MessageBox.alert("Percentage field - therefore the maximum value is 100");
			this.byId(oControlEvent.getSource().sId).setValue(100);
		}
	},

/* Department F4 Dialog methods */
	_setDepartmentF4Text: function(e) {
		if (this._departmentSelectDialog) {
    		this._departmentSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idZzDepartment').getValue());
    		this._departmentSelectDialog.getModel().detachRequestCompleted(this._setDepartmentF4Text, this);
		}
	},
	showDepartmentF4: function(e) {
	    if(typeof this.accountId === "undefined" || this.accountId === null || this.accountId === "") {
	        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL")); 
	        return;
	    }
		if (!this._departmentSelectDialog) {
			this._departmentSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZDepartmentSelectDialog", this);
			this._departmentSelectDialog.setModel(this.getView().getModel());
			this._departmentSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._departmentSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
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
			this._departmentSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._departmentSelectDialog.getModel().attachRequestCompleted(null, this._setDepartmentF4Text, this);
		var f = [];
		f.push(new sap.ui.model.Filter('LinkedBp', sap.ui.model.FilterOperator.EQ, this.accountId));
		this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			path: "/ZDepartmentSet",
			filters: f,
			template: this.departmentF4Template
		});
		this._departmentSelectDialog.open();
	},
	closeDepartmentF4: function(e) {
		this.byId('dialogDepartmentF4').close();
		this.departmentf4open = "";
	},
	setDepartment: function(e) {
		var params = e.getParameter("selectedItem");
		var idDepartment = params.data('ID');
		this.byId('idZzDepartment').setValue(idDepartment);
        this.convertDepartmentName(idDepartment);
	},
	searchDepartment: function(e) {
	    if(typeof this.accountId === "undefined" || this.accountId === null || this.accountId === "") {
	        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL")); 
	        return;
	    }
		var f = [];
		f.push(new sap.ui.model.Filter('LinkedBp', sap.ui.model.FilterOperator.EQ, this.accountId));
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('NameOrg1', sap.ui.model.FilterOperator.Contains, v));
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
    		this._zzModuleIdSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idzzModuleId').getValue());
    		this._zzModuleIdSelectDialog.getModel().detachRequestCompleted(this._setzzModuleIdF4Text, this);
		}
	},
	showzzModuleIdF4: function(e) {
		if (!this._zzModuleIdSelectDialog) {
			this._zzModuleIdSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZModuleSelectDialog", this);
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel());
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
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
			this._zzModuleIdSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._zzModuleIdSelectDialog.getModel().attachRequestCompleted(null, this._setzzModuleIdF4Text, this);
		var f = [];
		this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			//path: "/ZModuleCollection",
			path: "/AccountCollection('" + this.accountId + "')/ZModules",
			parameters: {
				select: "ZmoduleId,ZmoduleName"
			},
			filters: f,
			template: this.zzModuleIdF4Template
		});
		this._zzModuleIdSelectDialog.open();
	},
	closezzModuleIdF4: function(e) {
		this.byId('dialogzzModuleIdF4').close();
		this.zzModuleIdf4open = "";
	},
	setzzModuleId: function(e) {
		var params = e.getParameter("selectedItem");
		var idzzModuleId = params.data('ID');
		this.byId('idzzModuleId').setValue(idzzModuleId);
		this.convertModuleName(idzzModuleId);
	},
	searchzzModuleId: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('ZmoduleName', sap.ui.model.FilterOperator.Contains, v));
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
    		this._OppTypeSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idzzOppType').getValue());
    		this._OppTypeSelectDialog.getModel().detachRequestCompleted(this._setOppTypeF4Text, this);
		}
	},
	showOppTypeF4: function(e) {
		if (!this._OppTypeSelectDialog) {
			this._OppTypeSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZOppTypeSelectDialog", this);
			this._OppTypeSelectDialog.setModel(this.getView().getModel());
			this._OppTypeSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._OppTypeSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
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
			this._OppTypeSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._OppTypeSelectDialog.getModel().attachRequestCompleted(null, this._setOppTypeF4Text, this);
		var f = [];
		this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			path: "/ZOpportunityTypeHESet",
			filters: f,
			template: this.OppTypeF4Template
		});
		this._OppTypeSelectDialog.open();
	},
	closeOppTypeF4: function(e) {
		this.byId('dialogOppTypeF4').close();
		this.OppTypef4open = "";
	},
	setOppType: function(e) {
		var params = e.getParameter("selectedItem");
		var idOppType = params.data('ID');
		this.byId('idzzOppType').setValue(idOppType);
        this.convertCustOppType(idOppType);
	},
	searchOppType: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('Description', sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	}
	
});