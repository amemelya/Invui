# INVUI Application Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      INVUI Production Tracking                  │
└─────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌──────────────────┐
│  Login Screen    │
│  (admin/admin)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Product Selection        │
│ - Spindle75              │
│ - Spindle120             │
│ - Spindle200             │
│ [Logout Button]          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Process Selection        │
│ - Cutting                │
│ - Drilling               │
│ - Polishing              │
│ - Assembly               │
│ - Testing                │
│ [Back Button]            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Machine Selection        │
│ - Machine 1              │
│ - Machine 2              │
│ - Machine 3              │
│ [Back Button]            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Production Entry Form    │
│ ┌────────────────────┐   │
│ │ Worker Name: ____  │   │
│ │ Start Time:  ──:── │   │
│ │ End Time:    ──:── │   │
│ │ Units Prod:  ____  │   │
│ │                    │   │
│ │ [Submit] [Cancel]  │   │
│ │ [Back Button]      │   │
│ └────────────────────┘   │
└────────┬─────────────────┘
         │
         ├──────[Cancel]──────┐
         │                    │
         │                    ▼
         │            ┌──────────────┐
         │            │ Discarded    │
         │            │ [Back to     │
         │            │  Machines]   │
         │            └──────┬───────┘
         │                   │
         ▼                   │
┌──────────────────┐         │
│ Entry Saved ✓    │         │
│ [Back to         │         │
│  Machines List]  │         │
└────────┬─────────┘         │
         │                   │
         ▼                   │
┌──────────────────┐         │
│ Machine Select   │◄────────┘
│ - Can select     │
│   another        │
│   machine        │
│ - OR go back     │
└────────┬─────────┘
         │
         ├──────[Back]────┬────────┐
         │                │        │
         ▼                ▼        ▼
     [Another]      [Process]  [Product]
     [Machine]      [Select]   [Select]
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTH CONTEXT                             │
├─────────────────────────────────────────────────────────────┤
│ • isLoggedIn: boolean                                       │
│ • user: { role, name }                                      │
│ • login(username, password) → boolean                       │
│ • logout() → void                                           │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Controls Access
                        ▼
                   ┌──────────────┐
                   │ Root Layout  │
                   └──────┬───────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
    [NOT LOGGED IN]               [LOGGED IN]
         │                              │
         ▼                              ▼
    (Auth Stack)                   (Main Stack)
         │                              │
         └──────────────┬───────────────┘
                        │
         ┌──────────────┴─────────────────┐
         │                                │
┌────────▼──────────────────┐   ┌────────▼──────────────────┐
│    APP CONTEXT            │   │  PRODUCT DATA             │
├───────────────────────────┤   ├───────────────────────────┤
│ • selectedProduct         │   │ Products (from mockData)  │
│ • selectedProcess         │   │ Processes (from mockData) │
│ • selectedMachine         │   │ Machines (from mockData)  │
│ • entries[]               │   │                           │
│                           │   │ Data Structure:           │
│ • setSelectedProduct()    │   │ mockProducts[]            │
│ • setSelectedProcess()    │   │ mockProcesses{ id: [] }   │
│ • setSelectedMachine()    │   │ mockMachines{ id: [] }    │
│ • addProductionEntry()    │   │                           │
│ • resetSelection()        │   │                           │
└──────────────────────────┘   └───────────────────────────┘
```

## Data Flow During Production Entry

```
Production Entry Form
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
    User Input            Validation
    • Worker Name         • Name required
    • Times              • Times selected
    • Units              • Valid number
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
         ProductionEntry Object
         ┌──────────────────────┐
         │ {                    │
         │   id: unique_id      │
         │   machineId: xxx     │
         │   workerName: "John" │
         │   startTime: "09:00" │
         │   endTime: "17:00"   │
         │   unitsProduced: 150 │
         │   timestamp: ISO_str │
         │ }                    │
         └──────────┬───────────┘
                    │
                    ▼
         addProductionEntry()
         (AppContext)
                    │
                    ▼
    appState.entries[] Updated
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
    User Feedback        Navigation
    "Success!"          Back to Machine
                        Selection Screen
```

## Component Hierarchy

```
RootLayout
  │
  ├─ AuthProvider
  │    │
  │    └─ AppProvider
  │         │
  │         └─ Router
  │              │
  │              ├─ (Auth Stack)
  │              │    └─ LoginScreen
  │              │         ├─ TextInputField × 2
  │              │         └─ Button
  │              │
  │              └─ (Main Stack)
  │                   ├─ ProductSelectionScreen
  │                   │    ├─ ListItem × N
  │                   │    └─ Button
  │                   │
  │                   ├─ ProcessSelectionScreen
  │                   │    ├─ ListItem × N
  │                   │    └─ Button
  │                   │
  │                   ├─ MachineSelectionScreen
  │                   │    ├─ ListItem × N
  │                   │    └─ Button
  │                   │
  │                   └─ ProductionEntryScreen
  │                        ├─ TextInputField
  │                        ├─ TimePicker × 2
  │                        ├─ Button × 2
  │                        └─ InfoBox
```

## Navigation Map

```
LOGIN
  ↓
  ├─→ Success ──→ PRODUCTS ──→ [Select] ──→ PROCESSES ──→ [Select]
  │                  ↑                           ↑
  │                  └─ [Logout]                 └─ [Back]
  │
  └─→ Fail (alert)

PROCESSES ──→ [Select] ──→ MACHINES ──→ [Select] ──→ PRODUCTION ENTRY
    ↑                         ↑                             │
    └─ [Back]                 └─ [Back]          ┌─────────┴─────────┐
                                                  │                   │
                                             [Submit]            [Cancel]
                                                  │                   │
                                                  └─────┬─────────────┘
                                                        │
                                                   Back to MACHINES

PRODUCTION ENTRY (with context display)
  • Shows: Product → Process → Machine
  • Allows: Submit or Cancel
```

## Time Picker Flow

```
User taps "Start Time" / "End Time"
              │
              ▼
    Modal opens with scrollers
              │
         ┌────┴────┐
         ▼         ▼
      Hours      Minutes
    (0-23)      (0-59)
         │         │
         └────┬────┘
              │
              ▼
    User selects time
              │
              ▼
    [Confirm] button
              │
              ▼
    Format: HH:MM
              │
              ▼
    Modal closes
    Field updates
```

## Error Handling & Validation

```
Production Entry Submission
         │
         ▼
    ┌─ Worker Name empty? ──→ Alert + Stay
    │
    ├─ Start Time not set? ──→ Alert + Stay
    │
    ├─ End Time not set? ──→ Alert + Stay
    │
    ├─ Units invalid? ──→ Alert + Stay
    │
    └─ All valid? ──→ Create Entry ──→ Save ──→ Success Alert
                                              │
                                              ▼
                                         Go back
```
