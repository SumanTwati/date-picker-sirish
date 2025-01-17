import { BSDatePicker } from "./bs-date-picker";

export default function Home() {
  return (
    <div>
      <main className="flex align-items-center justify-content-center min-h-screen p-4">
        <div className="w-full max-w-30rem">
          <BSDatePicker
            defaultValue="2081-09-17"
            format="YYYY/MM/DD"
            language="np"
          />
        </div>
      </main>

      <main>
        <BSDatePicker
          defaultValue="2025-01-01"
          format="YYYY/MM/DD"
          language="en"
        />
      </main>
    </div>
  );
}
