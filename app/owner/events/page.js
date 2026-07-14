'use client';

import React from 'react';
import EventsManagementPage from '../../admin/events/page';

export default function OwnerEventsPage({ setTitle }) {
  return <EventsManagementPage setTitle={setTitle} role="owner" />;
}
