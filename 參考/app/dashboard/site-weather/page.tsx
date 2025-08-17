import React from 'react';

export default function SiteWeatherPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Site Weather</h1>
        <p className="text-muted-foreground">Monitor weather conditions at construction sites</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Weather Overview</h2>
          <p className="text-muted-foreground">Weather monitoring dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
}
