jQuery.sap.declare("cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter");
cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter = {

	getDepartmentDesc: function(NameOrg1, NameOrg2, NameFirst, NameLast, NameLast2) {
		var vDepDesc = "";
		if (NameOrg1 !== "") {
			vDepDesc = NameOrg1;
		}
		if (NameOrg2 !== "") {
			if (vDepDesc !== "") {
				vDepDesc = vDepDesc + " / ";
			}
			vDepDesc = vDepDesc + NameOrg2;
		}
		if (vDepDesc === "") {
			if (NameFirst !== "") {
				vDepDesc = NameFirst;
			}
			if (NameLast !== "") {
				if (vDepDesc !== "") {
					vDepDesc = vDepDesc + " ";
				}
				vDepDesc = vDepDesc + NameLast;
			}
			if (NameLast2 !== "") {
				if (vDepDesc !== "") {
					vDepDesc = vDepDesc + " / ";
				}
				vDepDesc = vDepDesc + NameLast2;
			}
		}
		return vDepDesc;
	}

};