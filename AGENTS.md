# AI Agents Instructions - Temperature Monitoring System

## Project Overview
Sistema de monitoreo de temperaturas para restaurantes multi-tenant con arquitectura de componentes React reutilizables.

---

## 🎯 Core Principles

You are an **expert React developer** specializing in modern web applications with the following expertise:

### Development Philosophy
- **SOLID Principles**: Write maintainable, scalable code following Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion
- **Component-Driven Architecture**: Build reusable, composable components
- **Microservices Approach**: Separate concerns into isolated, independent services
- **Type Safety First**: Leverage TypeScript for robust, error-free code
- **Performance Optimization**: Lazy loading, code splitting, memoization when appropriate

---

## 🛠️ Tech Stack & Versions

### Core Framework
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "~5.9.3",
  "vite": "^7.3.1"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4.1.18",
  "@tailwindcss/vite": "^4.1.18",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "next-themes": "^0.4.6"
}
```

### Shadcn/ui Components (ALL INSTALLED)
Available components:
- accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb
- button, calendar, card, carousel, chart, checkbox, collapsible, command
- context-menu, dialog, drawer, dropdown-menu, form, hover-card
- input, input-otp, label, menubar, navigation-menu, pagination, popover
- progress, radio-group, resizable, scroll-area, select, separator, sheet
- sidebar, skeleton, slider, sonner, switch, table, tabs, textarea
- toggle, toggle-group, tooltip

### Forms & Validation
```json
{
  "react-hook-form": "^7.71.1",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.6"
}
```

### Data Visualization
```json
{
  "recharts": "^2.15.4"
}
```

### Utilities
```json
{
  "date-fns": "^4.1.0",
  "lucide-react": "^0.563.0",
  "cmdk": "^1.1.1",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "react-resizable-panels": "^4.6.2",
  "vaul": "^1.1.2",
  "sonner": "^2.0.7"
}
```

---

## 📁 Project Structure

```
TempMonitor/
├── node_modules/
├── public/
│   └── (assets estáticos)
├── src/
│   ├── assets/                    # Imágenes, iconos, fonts
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/                    # Shadcn components (YA INSTALADOS - NO TOCAR)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── ... (todos los que instalaste)
│   │   │   └── index.ts          # CREAR: Export barrel
│   │   │
│   │   ├── common/                # CREAR: Componentes base reutilizables
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── EmptyState.types.ts
│   │   │   ├── ErrorBoundary/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── index.ts
│   │   │   ├── LoadingSpinner/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                # CREAR: Layout components
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Sidebar.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── DashboardLayout/
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── DashboardLayout.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── AuthLayout/
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── features/              # CREAR: Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── RegisterForm/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── restaurants/
│   │   │   │   ├── RestaurantSelector/
│   │   │   │   │   ├── RestaurantSelector.tsx
│   │   │   │   │   ├── RestaurantSelector.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── RestaurantForm/
│   │   │   │   ├── RestaurantCard/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── equipment/
│   │   │   │   ├── EquipmentCard/
│   │   │   │   ├── EquipmentForm/
│   │   │   │   ├── EquipmentList/
│   │   │   │   ├── EquipmentTable/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── temperature/
│   │   │   │   ├── TemperatureCard/
│   │   │   │   │   ├── TemperatureCard.tsx
│   │   │   │   │   ├── TemperatureCard.types.ts
│   │   │   │   │   ├── TemperatureCard.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── TemperatureForm/
│   │   │   │   ├── TemperatureChart/
│   │   │   │   ├── TemperatureTable/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── ReportFilters/
│   │   │   │   ├── ReportPreview/
│   │   │   │   ├── ReportTable/
│   │   │   │   ├── ReportChart/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── AlertCard/
│   │   │   │   ├── AlertList/
│   │   │   │   ├── AlertBadge/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UserTable/
│   │   │   │   ├── UserForm/
│   │   │   │   ├── InviteUserModal/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── StatCard/
│   │   │       ├── EquipmentGrid/
│   │   │       └── index.ts
│   │   │
│   │   └── shared/                # CREAR: Cross-feature shared components
│   │       ├── DateRangePicker/
│   │       ├── StatusBadge/
│   │       ├── RoleBadge/
│   │       └── index.ts
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useRestaurant.ts
│   │   ├── useEquipment.ts
│   │   ├── useTemperature.ts
│   │   ├── useAlerts.ts
│   │   ├── useReports.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── lib/                       # Utilities and helpers
│   │   ├── utils.ts               # Ya tienes (shadcn)
│   │   ├── constants.ts           # CREAR: App constants
│   │   ├── validators.ts          # CREAR: Zod schemas
│   │   ├── formatters.ts          # CREAR: Date, number formatters
│   │   ├── api-client.ts          # CREAR: Axios/fetch wrapper
│   │   └── pdf-generator.ts       # CREAR: PDF export logic
│   │
│   ├── services/                  # CREAR: API/Backend abstraction layer
│   │   ├── api/
│   │   │   ├── base.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── restaurant.service.ts
│   │   │   ├── equipment.service.ts
│   │   │   ├── temperature.service.ts
│   │   │   ├── alert.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── report.service.ts
│   │   │   └── index.ts
│   │   │
│   │   └── supabase/
│   │       ├── client.ts          # CREAR: Supabase client config
│   │       ├── auth.ts            # CREAR: Auth helpers
│   │       ├── types.ts           # CREAR: DB types (auto-generated)
│   │       └── index.ts
│   │
│   ├── types/                     # CREAR: TypeScript types and interfaces
│   │   ├── restaurant.types.ts
│   │   ├── equipment.types.ts
│   │   ├── temperature.types.ts
│   │   ├── user.types.ts
│   │   ├── alert.types.ts
│   │   ├── report.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts               # Export barrel
│   │
│   ├── store/                     # CREAR: State management
│   │   ├── AuthContext.tsx
│   │   ├── RestaurantContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   │
│   ├── pages/                     # CREAR: Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── equipment/
│   │   │   ├── EquipmentListPage.tsx
│   │   │   ├── EquipmentDetailPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── temperature/
│   │   │   ├── RegisterTemperaturePage.tsx
│   │   │   ├── TemperatureHistoryPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── alerts/
│   │   │   ├── AlertsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── users/
│   │   │   ├── UsersPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── SettingsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── router/                    # React Router setup
│   │   ├── index.tsx              # Ya tienes
│   │   ├── routes.tsx             # CREAR: Route definitions
│   │   ├── ProtectedRoute.tsx     # CREAR: Auth guard
│   │   └── RoleRoute.tsx          # CREAR: Role-based guard
│   │
│   ├── config/                    # CREAR: App configuration
│   │   ├── app.config.ts
│   │   ├── routes.config.ts
│   │   └── api.config.ts
│   │
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # Entry point
│   └── TempMonitorApp.tsx         # Root App component
│
├── .env                           # CREAR: Environment variables
├── .env.example                   # CREAR: Env template
├── .gitignore
├── AGENTS_INSTRUCTIONS.md         # Tu documento de instrucciones
├── components.json                # Shadcn config
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md                      # CREAR: Project documentation
```

---

## 🔒 Critical Rules

### 1. Version Control
**NEVER** change package versions without explicit permission. If you need a different version:
```
⚠️ STOP and ASK:
"I recommend updating [package] from [current] to [new] because [reason].
Should I proceed?"
```

### 2. Component Guidelines

#### DO ✅
- Use functional components with hooks
- Implement TypeScript interfaces for all props
- Follow single responsibility principle
- Create reusable, composable components
- Use Shadcn/ui components as base building blocks
- Implement proper error boundaries
- Add loading and error states
- Use React.memo() for expensive components
- Implement proper prop-types with TypeScript

#### DON'T ❌
- Modify Shadcn/ui components directly (extend them instead)
- Create inline styles (use Tailwind classes)
- Use class components
- Mix business logic with presentation
- Hardcode values (use constants)
- Ignore TypeScript errors
- Create God components (>300 lines)

### 3. TypeScript Standards

```typescript
// ✅ GOOD: Explicit types
interface TemperatureReading {
  id: string;
  equipmentId: string;
  temperature: number;
  recordedAt: Date;
  recordedBy: string;
  notes?: string;
}

// ❌ BAD: Any types
const data: any = {};
```

### 4. Code Organization (SOLID)

#### Single Responsibility
```typescript
// ✅ GOOD: Each component has one job
const TemperatureDisplay = ({ value }: { value: number }) => (
  <span className="text-2xl font-bold">{value}°C</span>
);

const TemperatureStatus = ({ value, range }: Props) => {
  const status = getStatus(value, range);
  return <Badge variant={status}>{status}</Badge>;
};

// ❌ BAD: Component doing too much
const TemperatureCard = () => {
  // Fetching data, displaying, validation, navigation...
};
```

#### Dependency Inversion
```typescript
// ✅ GOOD: Depend on abstractions
interface TemperatureService {
  getReadings(): Promise<Reading[]>;
  createReading(data: CreateReadingDTO): Promise<Reading>;
}

// ❌ BAD: Direct dependency on implementation
import { supabase } from './supabase';
```

### 5. Service Layer (Microservices Pattern)

```typescript
// services/api/temperatureService.ts
import { supabase } from '../supabase/client';
import type { TemperatureReading, CreateReadingDTO } from '@/types';

export class TemperatureService {
  async getReadings(equipmentId: string): Promise<TemperatureReading[]> {
    const { data, error } = await supabase
      .from('temperature_readings')
      .select('*')
      .eq('equipment_id', equipmentId);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async createReading(dto: CreateReadingDTO): Promise<TemperatureReading> {
    // Implementation
  }

  async getReadingsByDateRange(/* params */): Promise<TemperatureReading[]> {
    // Implementation
  }
}

// Export singleton instance
export const temperatureService = new TemperatureService();
```

### 6. Custom Hooks Pattern

```typescript
// hooks/useTemperature.ts
import { useState, useEffect } from 'react';
import { temperatureService } from '@/services/api/temperatureService';
import type { TemperatureReading } from '@/types';

export const useTemperature = (equipmentId: string) => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        const data = await temperatureService.getReadings(equipmentId);
        setReadings(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [equipmentId]);

  return { readings, loading, error };
};
```

### 7. Form Handling (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const temperatureSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment is required'),
  temperature: z.number().min(-50).max(50),
  notes: z.string().optional(),
});

type TemperatureFormData = z.infer<typeof temperatureSchema>;

const TemperatureForm = () => {
  const form = useForm<TemperatureFormData>({
    resolver: zodResolver(temperatureSchema),
    defaultValues: {
      equipmentId: '',
      temperature: 0,
      notes: '',
    },
  });

  const onSubmit = async (data: TemperatureFormData) => {
    // Handle submission
  };

  return (
    <Form {...form}>
      {/* Form fields */}
    </Form>
  );
};
```

### 8. Styling Guidelines

```typescript
// ✅ GOOD: Tailwind classes with cn() for conditional styling
import { cn } from '@/lib/utils';

const TemperatureCard = ({ status }: Props) => (
  <Card className={cn(
    "p-4 transition-colors",
    status === 'alert' && "border-red-500 bg-red-50",
    status === 'normal' && "border-green-500 bg-green-50"
  )}>
    {/* Content */}
  </Card>
);

// ❌ BAD: Inline styles
<div style={{ color: 'red', padding: '16px' }}>
```

### 9. Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
try {
  const data = await service.getData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  toast.error('Failed to load data. Please try again.');
  throw error; // Re-throw for component error boundary
}

// Component with error boundary
const DataDisplay = () => {
  const { data, error, loading } = useData();

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data) return <EmptyState />;

  return <DataTable data={data} />;
};
```

### 10. Performance Optimization

```typescript
// ✅ GOOD: Memoization for expensive computations
import { useMemo, useCallback } from 'react';

const TemperatureChart = ({ readings }: Props) => {
  const chartData = useMemo(() => 
    processReadingsForChart(readings),
    [readings]
  );

  const handleDataPointClick = useCallback((point) => {
    // Handle click
  }, []);

  return <Chart data={chartData} onClick={handleDataPointClick} />;
};

// ✅ GOOD: Lazy loading
const ReportsPage = lazy(() => import('./pages/Reports'));

// ❌ BAD: No optimization
const Chart = ({ readings }) => {
  const data = processReadings(readings); // Runs every render
  return <ChartComponent data={data} />;
};
```

---

## 🎨 UI/UX Standards

### Shadcn/ui Usage

```typescript
// ✅ GOOD: Extend Shadcn components
import { Button } from '@/components/ui/button';

const SubmitButton = ({ loading, children, ...props }: Props) => (
  <Button disabled={loading} {...props}>
    {loading ? <Spinner /> : children}
  </Button>
);

// ❌ BAD: Modifying ui/button.tsx directly
```

### Consistent Patterns

- **Loading states**: Use `<Skeleton>` from Shadcn
- **Empty states**: Custom component with icon + message + CTA
- **Toasts**: Use `sonner` for notifications
- **Modals**: Use `<Dialog>` or `<Sheet>` from Shadcn
- **Forms**: Always use `react-hook-form` + `zod`
- **Tables**: Use `<Table>` from Shadcn with pagination
- **Charts**: Use `recharts` with consistent color scheme

---

## 🔐 Security Best Practices

1. **Never expose secrets**: Use environment variables
2. **Validate all inputs**: Client AND server-side
3. **Sanitize user data**: Prevent XSS
4. **Implement RBAC**: Role-based access control
5. **Use Supabase RLS**: Row Level Security policies

---

## 📝 Documentation Standards

### Component Documentation
```typescript
/**
 * TemperatureCard - Displays equipment temperature with status indicator
 * 
 * @param equipment - Equipment object with name, location, and temp ranges
 * @param currentTemp - Current temperature reading
 * @param status - Equipment status: 'normal' | 'warning' | 'alert'
 * @param onViewHistory - Callback when user clicks "View History"
 * 
 * @example
 * <TemperatureCard
 *   equipment={refrigerator}
 *   currentTemp={3.5}
 *   status="normal"
 *   onViewHistory={() => navigate('/history')}
 * />
 */
export const TemperatureCard = ({ ... }: TemperatureCardProps) => {
  // Implementation
};
```

---

## 🚨 When to Ask Permission

**ALWAYS ASK BEFORE:**
1. Changing any package version
2. Adding new dependencies
3. Modifying project structure significantly
4. Changing database schema
5. Implementing breaking changes
6. Removing existing functionality

**Format:**
```
⚠️ PERMISSION REQUIRED

I recommend [action] because [reason].

Alternatives considered:
- [Alternative 1]
- [Alternative 2]

Impact: [Describe impact]

Should I proceed?
```

---

## ✅ Code Review Checklist

Before submitting code, verify:

- [ ] TypeScript: No `any` types, all interfaces defined
- [ ] SOLID: Each component has single responsibility
- [ ] Performance: Memoization where needed
- [ ] Error handling: Try-catch, error boundaries
- [ ] Loading states: Skeleton loaders implemented
- [ ] Empty states: Proper empty state components
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Mobile responsive: Works on all screen sizes
- [ ] Tailwind: No inline styles, using utility classes
- [ ] Tests: Unit tests for utilities, integration tests for features
- [ ] Documentation: JSDoc comments on complex functions

---

## 🎯 Quality Standards

### Code Quality Metrics
- **Max component size**: 300 lines
- **Max function size**: 50 lines
- **Cyclomatic complexity**: < 10
- **TypeScript coverage**: 100%
- **Test coverage**: > 80%

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90

---

## 📚 Additional Resources

- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

---

## 🤝 Communication Protocol

When working on tasks:

1. **Understand**: Clarify requirements before coding
2. **Plan**: Outline approach and ask for validation
3. **Implement**: Follow all guidelines above
4. **Test**: Verify functionality thoroughly
5. **Document**: Add clear comments and documentation
6. **Review**: Self-review against checklist

---

**Remember**: Quality over speed. Write code that is maintainable, scalable, and follows best practices. When in doubt, ASK!

---

*Last updated: February 10, 2026*
*Project: Temperature Monitoring System for Restaurants*
*Stack: React 19 + TypeScript + Vite + Shadcn/ui + Tailwind CSS*