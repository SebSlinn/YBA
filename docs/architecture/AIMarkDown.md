# YBA Website Redevelopment
## Solution Overview
Version: 1.0
Status: Architecture Agreed

---

# Vision

To replace the existing WordPress website with a modern, fast, mobile-first platform that:

- is easy for school staff to update
- separates content from presentation
- integrates with existing school systems
- can be hosted on-premise or in the cloud
- is maintainable for many years
- grows into the school's digital information platform

This is NOT simply a website.

It is the foundation of the school's digital presence.

---

# Project Objectives

The solution should:

✓ Look modern

✓ Be mobile first

✓ Be fast

✓ Be accessible (WCAG)

✓ Have a simple CMS

✓ Support multiple editors

✓ Integrate with existing systems

✓ Require minimal maintenance

✓ Have low hosting costs

✓ Be deployable anywhere

---

# Overall Architecture

                    Browser
                        │
                        │
                Next.js Frontend
                        │
                Service Interfaces
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        │               │                │
    Directus       Integrations     Authentication
        │               │
        └───────┬───────┘
                │
           PostgreSQL

---

# Architecture Principles

The architecture is divided into four layers.

Presentation Layer

Next.js

Responsible for:

- Pages
- Components
- Layout
- Styling
- User Experience

The presentation layer DOES NOT know:

- SQL
- PostgreSQL
- Bromcom
- Facebook
- Office365

It only communicates through service interfaces.

---

Content Layer

Directus

Responsible for:

- Pages
- News
- Blog
- Hero banners
- Staff editable content
- Menus
- Documents
- Images

Directus is the source of truth for editorial content.

---

Integration Layer

Responsible for connecting external systems.

Examples:

Bromcom

Facebook

Instagram

Office365

School Calendar

Future systems

Each integration is isolated.

No integration should know about another integration.

---

Infrastructure Layer

Responsible for:

Docker

Networking

Hosting

SSL

Backups

Deployment

Reverse Proxy

Infrastructure should be independent of application code.

---

# Folder Structure

Repository

/frontend
    Next.js application

/cms
    Directus configuration

/docker
    Docker Compose
    Infrastructure

/docs
    Documentation

/design
    Branding
    Wireframes
    Design System

---

# Frontend Architecture

Frontend contains ONLY presentation.

src/

app/

components/

services/

styles/

lib/

Components never communicate directly with Directus.

Instead:

Page

↓

Component

↓

Service

↓

API

Example

Hero Component

↓

HeroService

↓

Directus

---

# Services

Every data source is hidden behind a service.

Examples

HeroService

NewsService

EventService

CalendarService

SettingsService

Later these services will call Directus.

Initially they return hard coded data.

This keeps development moving.

---

# CMS

Directus owns:

Hero

Pages

News

Blog

Documents

Downloads

Menus

Images

Staff should be able to update content without developers.

---

# External Systems

External systems remain the source of truth.

Examples

Bromcom

Attendance

House Points

Timetable

Office365

Forms

Calendars

Facebook

Instagram

These are NOT copied into Directus.

Instead they are displayed through connectors.

---

# Homepage Philosophy

The homepage is composed of modules.

Each module is independent.

Example

Hero

Latest News

Quick Links

Upcoming Events

Facebook Highlights

House Points

Attendance

Footer

Modules can be:

Enabled

Disabled

Reordered

without changing code.

---

# Design Philosophy

Use the existing YBA branding.

Primary colour:

YBA Navy

Accent colours:

Magenta

Gold

Teal

Large photography.

Minimal text.

Large typography.

Strong whitespace.

Responsive first.

---

# Hero Design

The hero consists of:

Header

Background

Overlay

Logo

Heading

CTA

Bottom Gradient

Navy Strip

Magenta Divider

The Hero is a reusable component.

Future enhancements:

Slideshow

Video

Seasonal branding

Campaign pages

---

# Future Integrations

Bromcom

Attendance

House Points

Calendar

Office365

Forms

Facebook

Instagram

Google Maps

Weather

Emergency Notices

These are optional modules.

---

# Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

CMS

Directus

Database

PostgreSQL

Infrastructure

Docker Compose

Hosting

Initially local development.

Production:

School Server

or VPS

No architectural changes required.

---

# Project Principles

1.
Presentation contains no business logic.

2.
Directus owns editorial content.

3.
External systems remain the source of truth.

4.
Every external system has its own connector.

5.
Components have a single responsibility.

6.
Every layer communicates through interfaces.

7.
Homepage sections are modular.

8.
Infrastructure is independent of application code.

9.
Documentation is part of the solution.

10.
Architecture changes require documentation updates.

---

# Development Roadmap

Phase 1

Project Foundation

✓ Docker

✓ PostgreSQL

✓ Directus

✓ Next.js

---

Phase 2

Frontend

Header

Hero

News Cards

Quick Links

Events

Footer

Responsive Layout

---

Phase 3

CMS

Hero Collection

News Collection

Pages

Menus

Documents

Media

---

Phase 4

Integration Layer

Facebook

Instagram

Office365

Bromcom

Calendar

---

Phase 5

Deployment

Reverse Proxy

SSL

Backups

Monitoring

School Server

---

# Current Status

Completed

✓ Repository created

✓ Docker operational

✓ Directus operational

✓ PostgreSQL operational

✓ Next.js project created

✓ Initial component structure

✓ Design direction agreed

In Progress

Landing Page Framework

Next Step

Complete Hero component

Then:

Latest News module

---

# Development Rules

Every feature should:

Compile

Run

Be committed to Git

Remain documented

No unfinished architecture changes.

No mixing presentation with business logic.

No component should know where its data originates.

---

# Success Criteria

The finished solution should allow:

Teachers to edit content.

The Head to publish news.

Future integrations without redesign.

Hosting on school servers.

Migration to cloud if required.

Long-term maintainability.
