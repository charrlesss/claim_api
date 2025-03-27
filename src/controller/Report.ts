import express from "express";
import { PrismaClient } from "@prisma/client";
import { saveUserLogs, saveUserLogsCode } from "./Claims";

const prisma = new PrismaClient();
const Report = express.Router();

const reportQry = `
SELECT 
    c.Name,
    c.unit_insured,
    a.policyNo,
    c.ChassisNo,
    c.MotorNo,
    b.date_received,
    b.date_report,
    b.claim_type,
    b.amount_claim,
    b.amount_approved,
    b.participation,
    b.net_amount,
    b.name_ttpd,
    b.claimStatus
FROM
    claims.claims a
        LEFT JOIN
    claims.claims_details b ON a.claim_id = b.claim_id
    left join (
	     SELECT 
              a.IDNo,
                  a.PolicyType,
                  a.PolicyNo,
                  'UCSMI' AS Department,
                  IF(b.company <> ''
                      AND b.company IS NOT NULL, b.company, CONCAT(IF(b.lastname <> ''
                      AND b.lastname IS NOT NULL, CONCAT(b.lastname, ', '), ''), b.firstname, IF(b.suffix <> '' AND b.suffix IS NOT NULL, CONCAT(', ', b.suffix), ''))) AS Name,
                  c.ChassisNo,
                  c.MotorNo,
                  concat(c.Make,' ',c.BodyType,' ',c.Model,' ',c.Color ) as unit_insured
          FROM
              new_upward_insurance_ucsmi.policy a
          LEFT JOIN new_upward_insurance_ucsmi.entry_client b ON a.IDNo = b.entry_client_id
          LEFT JOIN new_upward_insurance_ucsmi.vpolicy c ON a.PolicyNo = c.PolicyNo 
          UNION ALL 
          SELECT 
              a.IDNo,
                  a.PolicyType,
                  a.PolicyNo,
                  'UMIS' AS Department,
                  IF(b.company <> ''
                      AND b.company IS NOT NULL, b.company, CONCAT(IF(b.lastname <> ''
                      AND b.lastname IS NOT NULL, CONCAT(b.lastname, ', '), ''), b.firstname, IF(b.suffix <> '' AND b.suffix IS NOT NULL, CONCAT(', ', b.suffix), ''))) AS Name,
                  c.ChassisNo,
                  c.MotorNo,
                  concat(c.Make,' ',c.BodyType,' ',c.Model,' ',c.Color ) as unit_insured
          FROM
              upward_insurance_umis.policy a
          LEFT JOIN upward_insurance_umis.entry_client b ON a.IDNo = b.entry_client_id
          LEFT JOIN upward_insurance_umis.vpolicy c ON a.PolicyNo = c.PolicyNo
    ) c on a.policyNo = c.PolicyNo
WHERE
    b.status = 'Ongoing' and
    
    a.department = 'UMIS' and
    b.claimStatus = 'For Loa' and 
    b.claim_type = 'Own Damage' 
`;

Report.post("/approved-settled", async (req, res) => {
  try {

    res.send({
      message: "Successfully Get Report.",
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.log(error.message);
    res.send({
      message: `We're experiencing a server issue. Please try again in a few minutes. If the issue continues, report it to IT with the details of what you were doing at the time.`,
      success: false,
      data: [],
    });
  }
});
export default Report;
