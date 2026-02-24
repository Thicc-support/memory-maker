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
          Everything you need to know about creating your family's new favorite book.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full bg-white p-8 rounded-2xl shadow-sm border border-border">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-bold">How does it work?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Our AI interviewer asks you a few simple questions about your story, memories, and values. Then, it weaves your answers into a beautiful narrative and generates custom illustrations to match. You can review and edit everything before we print and ship your hardcover book!
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-bold">How much does it cost?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            A custom 32-page hardcover book starts at $45, which includes the AI storytelling process, custom illustrations, and standard shipping. We also offer digital-only versions for $20 if you prefer to read on a tablet.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-bold">Do I get to preview the book?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Absolutely! Before you buy, you can read the entire story and see all the illustrations. If something isn't quite right, you can ask our AI to rewrite a page or regenerate an image until it's perfect.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-bold">Are my photos and data safe?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed">
            Yes. Your privacy is our top priority. We only use your information to generate your specific book, and we never share your data or use it to train public AI models. You have full control over your account and creations.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}