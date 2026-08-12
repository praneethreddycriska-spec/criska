"use client";

import { useState } from "react";
import { JobApplication, ScheduledInterview } from "@/types/ats";

export function InterviewScheduler({
  application,
  isOpen,
  onClose,
  onScheduleSuccess,
}: {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleSuccess: (interview: ScheduledInterview) => void;
}) {
  const [interviewType, setInterviewType] = useState<ScheduledInterview["interviewType"]>("Technical Round");
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10));
  const [time, setTime] = useState<string>("14:00");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [interviewerName, setInterviewerName] = useState<string>("Criska Lead Architect");
  const [interviewerEmail] = useState<string>("info2@criska.in");
  const [meetingUrl, setMeetingUrl] = useState<string>("https://meet.google.com/criska-tech-interview");
  const [notes, setNotes] = useState<string>("System architecture, coding & ATS screening review.");

  if (!isOpen || !application) return null;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newInterview: ScheduledInterview = {
      id: `interview-${Date.now()}`,
      interviewType,
      date,
      time,
      durationMinutes,
      interviewerName,
      interviewerEmail,
      meetingUrl,
      notes,
      createdAt: new Date().toISOString(),
    };

    // Download .ics Calendar File
    downloadIcsFile(application, newInterview);

    onScheduleSuccess(newInterview);
    onClose();
  };

  const downloadIcsFile = (app: JobApplication, interview: ScheduledInterview) => {
    const startDateTime = new Date(`${interview.date}T${interview.time}:00`)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const endDateTime = new Date(new Date(`${interview.date}T${interview.time}:00`).getTime() + interview.durationMinutes * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    const csContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Criska ATS//Interview Scheduler//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Criska Interview (${interview.interviewType}): ${app.fullName} - ${app.jobTitle}`,
      `DESCRIPTION:${interview.notes} | Meeting Link: ${interview.meetingUrl}`,
      `LOCATION:${interview.meetingUrl}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `ORGANIZER;CN=${interview.interviewerName}:mailto:${interview.interviewerEmail}`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${app.fullName}:mailto:${app.email}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([csContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Criska_Interview_${app.fullName.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <span className="eyebrow">Schedule Interview</span>
            <h2 className="font-display text-[22px] leading-tight text-foreground">{application.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:bg-panel hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as ScheduledInterview["interviewType"])}
              className="w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-[14.5px] text-foreground outline-none"
            >
              <option value="Technical Round">Technical Round</option>
              <option value="HR Round">HR / Cultural Round</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Executive Interview">Executive Final Interview</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Interviewer Name
              </label>
              <input
                type="text"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
              Meeting URL (Google Meet / Teams / Zoom)
            </label>
            <input
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full rounded-xl border border-border bg-paper px-4 py-2 text-[14px] text-foreground outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
              Agenda & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-border bg-paper p-2.5 text-[13.5px] text-foreground outline-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-pill btn-ghost text-[14px]">
              Cancel
            </button>
            <button type="submit" className="btn-pill btn-primary text-[14px]">
              📅 Confirm & Download Calendar (.ics) Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
