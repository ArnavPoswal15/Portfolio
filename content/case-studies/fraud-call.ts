import type { CaseStudyContent } from '../types';

export const fraudCallCaseStudy: CaseStudyContent = {
  slug: 'fraud-call',
  title: 'Fraud Call Detection',
  description:
    'Classify phone-call transcripts as fraud or normal with IBM Watson Speech to Text, text normalization, and fine-tuned XLNet—95% on 21 held-out recordings; offline evaluation, not live call blocking.',
  introLede:
    'Scam-call classification on IBM Watson transcripts: normalize utterances, score with fine-tuned XLNet, and report accuracy on a held-out recording set—not live telephony or in-call blocking.',
  stackLine:
    'Python, IBM Watson Speech to Text, XLNet (<code>xlnet-base-cased</code>), scikit-learn, Google Colab · <a href="https://github.com/ArnavPoswal15/Fraud-Call-Detection">GitHub</a> · <a href="https://huggingface.co/ArnavPoswal15/xlnet-fraud-call">Hugging Face weights</a>',
  githubUrl: 'https://github.com/ArnavPoswal15/Fraud-Call-Detection',
  extraFooterLinks: [
    {
      label: 'Open in Colab',
      href: 'https://colab.research.google.com/github/ArnavPoswal15/Fraud-Call-Detection/blob/main/AIFraudCall.ipynb',
    },
  ],
  nextProject: {
    slug: 'orderflow',
    title: 'OrderFlow',
    desc: 'Kafka saga checkout with zero overselling.',
  },
  sections: [
    {
      type: 'prose',
      heading: 'Context',
      paragraphs: [
        'This was my B.Tech <strong>minor project</strong> in the <strong>7th semester</strong>: build a pipeline that reads call transcripts and labels them fraud or not fraud. The goal was to learn speech-to-text integration, text normalization, and transformer fine-tuning—not to ship real-time call blocking.',
        'Evaluation uses pre-transcribed JSON from IBM Watson on a fixed set of recordings. You can rerun the notebook on Colab without retraining—the checkpoint downloads from Hugging Face.',
      ],
    },
    {
      type: 'prose',
      heading: 'Problem',
      paragraphs: [
        'Scam calls reuse themes—tax debt, account suspension, urgent wire transfers—but the exact wording changes every week. Keyword lists miss paraphrases and polite framing.',
        'The model needs context from full utterances after normalization: contractions expanded, stopwords trimmed, lemmas aligned with the training vocabulary in <code>NLP_txt/</code>.',
      ],
    },
    {
      type: 'prose',
      heading: 'Pipeline',
      paragraphs: [
        'Audio (or existing Watson JSON in <code>SpeechToText/json/</code>) flows through IBM Watson Speech to Text with speaker labels. The notebook normalizes each transcript, then runs a two-class XLNet head fine-tuned from <code>xlnet-base-cased</code>.',
        'Training mixes scraped scam-related tweets (fraud class) with Santa Barbara Corpus conversation excerpts (normal class)—see the repo README for how <code>Dataset.csv</code> is built. Ground truth for the 21 test recordings follows a simple filename rule: names containing <code>-</code> (e.g. <code>irs_tax-fraud.json</code>) are fraud; <code>SBC*.json</code> files are normal.',
      ],
    },
    {
      type: 'gallery',
      heading: 'Evaluation',
      rows: [
        {
          shots: [
            {
              src: 'fraud-call/evaluation-table.png',
              width: 3024,
              height: 1342,
              preferPng: true,
              alt: 'Colab results table listing each test recording with predicted and actual fraud labels',
              caption:
                'Per-recording Colab output—20 of 21 correct (95.24%). One false positive: normal recording <code>SBC047</code> scored as fraud.',
              ariaLabel: 'Open image: evaluation table',
              layout: 'wide',
            },
          ],
        },
        {
          shots: [
            {
              src: 'fraud-call/metrics.png',
              width: 1189,
              height: 440,
              preferPng: true,
              alt: 'Confusion matrix and bar chart of accuracy, precision, recall, and F1 score',
              caption:
                'Confusion matrix plus summary bars—precision 0.91, recall 1.00, F1 0.95 on the same 21 recordings.',
              ariaLabel: 'Open image: metrics summary',
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
          heading: 'Speech to text and labels',
          body: 'IBM Watson Speech to Text produces JSON with speaker-labeled segments. For evaluation, fraud vs normal is inferred from filenames: <code>*-fraud.json</code> vs <code>SBC*.json</code>, matching the notebook’s scoring rule.',
        },
        {
          heading: 'Text normalization',
          body: 'The pipeline lowercases, strips punctuation, expands contractions, removes stopwords, and lemmatizes using word lists under <code>NLP_txt/</code> so inference text matches training preprocessing.',
        },
        {
          heading: 'Model and hosting',
          body: 'Fine-tuned weights live on Hugging Face (<code>ArnavPoswal15/xlnet-fraud-call</code>). Colab downloads them by default; set <code>RETRAIN = True</code> in the notebook to fine-tune again on <code>Dataset.csv</code> (GPU recommended).',
        },
      ],
    },
    {
      type: 'results',
      heading: 'Proof',
      metric: '20/21 · 95.2% accurate',
      paragraphs: [
        'On <strong>21 test recordings</strong> (10 fraud, 11 normal), the model classified <strong>20 correctly</strong>. All 10 fraud calls were caught; one normal call (<code>SBC047</code>) was flagged as fraud—matching the README and the table above.',
      ],
      noteLine:
        'The held-out set is small—one recording shifts accuracy by about 5%. Fraud training text came from tweets and normal text from conversation transcripts, so performance on other call types may differ. Fraud test transcripts tend to be shorter than normal ones.',
    },
    {
      type: 'retro',
      heading: 'What I’d change next',
      items: [
        'Grow a larger held-out set with in-domain fraud audio transcripts, not only tweet-derived training text.',
        'Report confidence thresholds and calibration, not only argmax labels on 21 files.',
        'Avoid publishing raw third-party corpus text on a marketing page—link to the repo and Colab instead.',
        'Seed training runs or document variance when <code>RETRAIN</code> is enabled—the notebook notes unseeded runs drift slightly.',
      ],
    },
  ],
};
