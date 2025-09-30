export type CTA = {
  label: string;
  target: string;
};

export type HeroSection = {
  type: 'hero';
  props: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    primaryCta?: CTA;
    secondaryCta?: CTA;
  };
};

export type BenefitSection = {
  type: 'benefits';
  props: {
    heading?: string;
    items: { title: string; description: string }[];
  };
};

export type LocationsSection = {
  type: 'locations';
  props: {
    heading?: string;
    description?: string;
  };
};

export type FAQSection = {
  type: 'faq';
  props: {
    heading?: string;
    items: { question: string; answer: string }[];
  };
};

export type FormField = {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'tel' | 'select';
  options?: string[];
  required?: boolean;
};

export type FormSection = {
  type: 'form';
  props: {
    id?: string;
    heading?: string;
    description?: string;
    submitLabel?: string;
    successTitle?: string;
    successBody?: string;
    fields: FormField[];
  };
};

export type FooterSection = {
  type: 'footer';
  props: {
    legal?: string;
    links?: { label: string; href: string }[];
  };
};

export type Section =
  | HeroSection
  | BenefitSection
  | LocationsSection
  | FAQSection
  | FormSection
  | FooterSection;

export type PageSchema = Section[];
