import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col justify-center gap-6"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            TalentPilot
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
            AI job tracking, ready for the first real workflow.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The project scaffold is wired for React, Express, Prisma,
            PostgreSQL, Tailwind, shadcn/ui, React Query, React Router, and
            Framer Motion.
          </p>
        </div>
        <div>
          <Button type="button">Add application</Button>
        </div>
      </motion.section>
    </main>
  );
}
