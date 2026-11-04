import type { CaseStudyContent } from '../types';

export const orderflowCaseStudy: CaseStudyContent = {
  slug: 'orderflow',
  title: 'OrderFlow',
  description:
    'Event-driven grocery-style checkout: three bounded contexts, Kafka choreographed saga, transactional outbox, and a k6 race test with zero overselling.',
  introLede:
    'A distributed checkout where order, inventory, and payment each own a database and coordinate through events—not synchronous REST chains.',
  heroTheme: 'dark',
  stackLine:
    'Java 21, Spring Boot, Kafka, PostgreSQL, Redis, Flyway, Testcontainers, Next.js storefront, k6',
  githubUrl: 'https://github.com/ArnavPoswal15/orderflow-platform',
  nextProject: {
    slug: 'focusfleet',
    title: 'FocusFleet',
    desc: 'Gradio prototype to Next.js—live driver monitoring on Hugging Face.',
  },
  sections: [
    {
      type: 'prose',
      heading: 'Problem',
      paragraphs: [
        'The platform models grocery-style checkout with three bounded contexts: order, inventory, and payment. Each service has its own PostgreSQL database so teams can deploy and fail independently.',
        'The hard part is concurrency on a hot SKU: many shoppers can hit checkout at once. The system must never oversell, must not lose events after a commit, and must roll back automatically when payment fails—release stock and refund the customer without manual ops.',
      ],
    },
    {
      type: 'figure',
      svgPath: 'content/case-studies/orderflow/assets/arch.svg',
      caption:
        'Choreographed saga: no central orchestrator. Services react to Kafka topics and emit compensation events when a step fails.',
    },
    {
      type: 'gallery',
      heading: 'In the browser',
      rows: [
        {
          shots: [
            {
              src: 'orderflow/storefront.png',
              width: 3006,
              height: 1568,
              alt: 'OrderFlow Next.js storefront with product grid and checkout',
              caption: 'Next.js storefront—browse SKUs and start checkout against the order API.',
              ariaLabel: 'Open image: storefront',
            },
            {
              src: 'orderflow/order-timeline.png',
              width: 3006,
              height: 1568,
              alt: 'Order detail page showing status timeline updated over SSE',
              caption:
                'Order timeline driven by server-sent events as inventory and payment steps complete.',
              ariaLabel: 'Open image: order timeline',
            },
          ],
        },
        {
          layout: 'pair',
          shots: [
            {
              src: 'orderflow/ops-flash-sale.png',
              width: 3006,
              height: 1568,
              alt: 'Operations view during flash-sale load test with concurrent checkouts',
              caption:
                'Flash-sale scenario: many concurrent checkouts against a single unit of stock.',
              ariaLabel: 'Open image: flash-sale scenario',
              layout: 'wide',
            },
            {
              src: 'orderflow/kibana-dashboard.png',
              width: 3024,
              height: 1536,
              alt: 'Kibana dashboard for OrderFlow metrics and checkout health',
              caption: 'Kibana dashboards for checkout volume, failures, and saga outcomes.',
              ariaLabel: 'Open image: Kibana dashboard',
              layout: 'wide',
            },
          ],
        },
        {
          shots: [
            {
              src: 'orderflow/kibana-trace.png',
              width: 3024,
              height: 1552,
              alt: 'Distributed trace in Kibana across order, inventory, and payment services',
              caption:
                'End-to-end trace across order, inventory, and payment—correlation IDs on the event path.',
              ariaLabel: 'Open image: distributed trace',
              layout: 'wide',
            },
          ],
        },
      ],
    },
    {
      type: 'specs',
      rows: [
        {
          heading: 'Why Kafka, not sync REST chains',
          body: 'Each bounded context can fail and recover on its own. Kafka absorbs checkout spikes and fits a choreographed saga—inventory reserves, payment captures, and failures publish compensation events consumers can replay. The tradeoff is operational complexity and at-least-once delivery, which forces idempotent handlers everywhere.',
        },
        {
          heading: 'Transactional outbox',
          body: 'Domain changes and an outbox row commit in one database transaction; a relay publishes to Kafka afterward. That avoids the classic split brain: database committed but no event ever sent. Order, inventory, and payment services each own their outbox table.',
        },
        {
          heading: 'Idempotency and atomic stock',
          body: 'Consumers record <code>eventId</code> and ignore duplicates under at-least-once delivery. Inventory reserves with <code>UPDATE … WHERE available &gt;= qty</code> under row lock so concurrent reservations have a single winner; losers get <code>inventory.rejected</code> and follow the cancellation path.',
        },
      ],
    },
    {
      type: 'results',
      heading: 'Proof',
      metric: '1 order · 0 overselling',
      paragraphs: [
        'k6 fired <strong>50 concurrent checkout attempts</strong> against <strong>1 unit</strong> of stock. Exactly one order confirmed; the rest failed through <code>inventory.rejected</code> and cancellation—not by averaging load, but by racing on one SKU.',
      ],
      noteLine:
        'Testcontainers integration tests and nine acceptance scenarios back the happy path and compensation flows in CI.',
    },
    {
      type: 'retro',
      heading: 'What I’d change next',
      items: [
        'Add saga observability—correlation IDs on every event and traces in Kibana—before adding more services.',
        'Re-evaluate an orchestrated saga if business rules explode; choreography gets hard to reason about in one diagram.',
        'Run sustained RPS and Kafka lag SLO tests, not only the single-SKU race.',
        'Harden dead-letter replay tooling and runbooks so ops can recover without reading Java stack traces.',
      ],
    },
  ],
};
