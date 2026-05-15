import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section className="py-24 container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold mb-4 text-primary-foreground">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about creating a family storybook keepsake.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full bg-white p-8 rounded-2xl shadow-sm border border-border">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-bold">What kinds of books can I make?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            You can make books about a real person, couple, pet, family, career, military service, travel adventure, childhood memory, life lesson, or family tradition. The book is story-first: photos help with details, but the heart is the person and memory.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-bold">Do I need photos?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            No. Photos are optional. If you upload them, they help with people, places, uniforms, pets, homes, trips, and meaningful objects. You can still create a book from written memories alone.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-bold">How much does it cost?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Digital keepsake books are $19.99. Printed softcover keepsakes are $39.99, and premium hardcover keepsakes are $59.99. Printed books are manually reviewed before fulfillment so the final book looks right.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-bold">Do I get to choose the title and cover?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Yes. You can choose from suggested titles or write your own, then pick the cover direction and illustration style before generating the book.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg font-bold">Do I get to preview the book?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Yes. You can preview the generated book and edit pages before ordering. This is especially important for real family stories, names, places, and memories.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-lg font-bold">Are my photos and family details safe?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Your private family details are used to create your book. We do not sell your information, and private uploads should only be used for your own book experience.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
