import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { useAdminContext } from "../../Hooks/AdminContext";
import CircularLoader from "../../components/loaders/CircularLoader";
import { _detail_lead_by_id } from "../../DAL/Leads/leads";
import { enqueueSnackbar } from "notistack";
import { LEADS_PRIVILEGE } from "../../utils/constant_new";

import LeadPrimaryInfo from "./components/details/LeadPrimaryInfo";
import LeadJourneyTimeline from "./components/details/LeadJourneyTimeline";
import LeadUpdateCard from "./components/details/LeadUpdateCard";
import LeadActivityCard from "./components/details/LeadActivityCard";
import LeadInternalNotesTab from "./components/details/LeadInternalNotesTab";
import MUICustomTabs from "../../components/MUICustomTabs";

const LeadDetail = () => {
  const { id } = useParams();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();

  const [isLoading, setIsLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [leadHistory, setLeadHistory] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const editSectionRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getLeadDetail = async () => {
    setIsLoading(true);
    const response = await _detail_lead_by_id(id, "with_history");
    if (response?.code === 200) {
      setLead(response?.lead || null);
      setNotes(response?.lead?.notes || []);
      setLeadHistory(response?.lead_history || []);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch lead", {
        variant: "error",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getLeadDetail();
  }, [id]);

  useEffect(() => {
    setNavBarTitle("Lead Detail");
    setIsBackButton(true);
  }, [lead]);

  if (isLoading) return <CircularLoader />;
  if (!lead) return null;

  const sectionStyle = {
    p: 3,
    border: "1px solid #E0E0E0",
    borderRadius: "12px",
    bgcolor: "#FFFFFF",
    height: "100%",
  };

  const sectionStyleRightSide = {
    p: 2,
    border: "1px solid #E0E0E0",
    borderRadius: "12px",
    bgcolor: "#FFFFFF",
    flexGrow: 1,
  };

  const sectionStyleMsg = {
    p: 2,
    border: "1px solid #E0E0E0",
    borderRadius: "12px",
    bgcolor: "#FFFFFF",
  };

  const labelStyle = {
    color: "#8E8E93",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    mb: 0.5,
  };

  const valueStyle = {
    color: "#1C1C1E",
    fontSize: "15px",
    fontWeight: 500,
  };

  return (
    <Box className="mt-3" sx={{ bgcolor: "#FFFFFF", minHeight: "100vh" }}>
      <div className="row g-3 align-items-stretch">
        <div className="col-12 col-lg-8">
          <LeadPrimaryInfo
            lead={lead}
            sectionStyle={sectionStyle}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
          />
        </div>

        {(LEADS_PRIVILEGE?.change_assign_to ||
          LEADS_PRIVILEGE?.customer_remarks) && (
          <div className="col-12 col-lg-4">
            <Stack spacing={2} sx={{ height: "100%" }}>
              {LEADS_PRIVILEGE?.change_assign_to && (
                <LeadUpdateCard
                  lead={lead}
                  sectionStyle={sectionStyleRightSide}
                  labelStyle={labelStyle}
                  setLead={setLead}
                  setLeadHistory={setLeadHistory}
                />
              )}

              {LEADS_PRIVILEGE?.customer_remarks && (
                <LeadActivityCard
                  lead={lead}
                  sectionStyle={sectionStyleRightSide}
                  labelStyle={labelStyle}
                  setLead={setLead}
                  setLeadHistory={setLeadHistory}
                  setNotes={setNotes}
                  editNote={editNote}
                  setEditNote={setEditNote}
                  editSectionRef={editSectionRef}
                />
              )}
            </Stack>
          </div>
        )}
      </div>

      <div className="row mt-1">
        <div className="col-12">
          <MUICustomTabs
            value={tabValue}
            handleChange={handleTabChange}
            data={[
              {
                title: "Timeline",
                component: (
                  <LeadJourneyTimeline
                    lead={lead}
                    leadHistory={leadHistory}
                    labelStyle={labelStyle}
                    sectionStyle={sectionStyle}
                  />
                ),
              },
              {
                title: "Internal Notes",
                component: (
                  <LeadInternalNotesTab
                    lead_id={lead?._id}
                    sectionStyle={sectionStyleMsg}
                    labelStyle={labelStyle}
                    notes={notes}
                    setNotes={setNotes}
                    setEditNote={setEditNote}
                    editSectionRef={editSectionRef}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </Box>
  );
};

export default LeadDetail;
