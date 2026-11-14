import React from 'react';
import { Shield, Cpu, FileCheck2, Lock } from 'lucide-react';
import { Translations } from '../utils/i18n';

interface InfoSectionsProps {
  t: Translations;
}

const SUPPORTED_AI_SYSTEMS = [
  {
    name: 'Midjourney (v5 / v6 / v6.1 / Niji)',
    keys: 'EXIF Software · ImageDescription · Job ID · IPTC DigitalSourceType',
  },
  {
    name: 'Stable Diffusion (Automatic1111 / Forge)',
    keys: 'PNG tEXt parameters · Negative prompt · Sampler · CFG Scale · Model Hash',
  },
  {
    name: 'ComfyUI & Flux.1 Pipelines',
    keys: 'PNG tEXt workflow · prompt JSON graph · KSampler node state',
  },
  {
    name: 'OpenAI DALL·E 3 & ChatGPT Vision',
    keys: 'JPEG APP11 JUMBF · C2PA Claim Manifest · OpenAI Signer Certificate',
  },
  {
    name: 'Adobe Firefly & Generative Fill',
    keys: 'XMP c2pa:actions · DigitalSourceType trainedAlgorithmicMedia · CreatorTool',
  },
  {
    name: 'Google Imagen / Leonardo.Ai / InvokeAI',
    keys: 'EXIF UserComment · XMP Credit · PNG iTXt Dream / sd-metadata chunks',
  },
  {
    name: 'Microsoft Designer & Copilot (MAI-Image)',
    keys: 'JPEG APP11 / PNG caBX JUMBF · C2PA Claim Manifest · Microsoft Corporation Signer',
  },
  {
    name: 'Meta AI (Imagine / Muse) & Apple Image Playground',
    keys: 'IPTC DigitalSourceType · XMP exifEX:Model · EXIF UserComment / Software',
  },
  {
    name: 'Amazon Titan & Nova Canvas (AWS Bedrock)',
    keys: 'JUMBF c2pa.assertions · C2PA Claim Generator · XMP DigitalSourceType',
  },
  {
    name: 'ByteDance Seedream / Recraft / Qwen-Image',
    keys: 'C2PA JUMBF Box · XMP TC260 AIGC-Label · PNG iTXt / tEXt Chunks',
  },
  {
    name: 'Fooocus / SwarmUI / Kohya WebUI',
    keys: 'PNG tEXt Comment JSON · sui_image_params · EXIF UserComment JSON',
  },
];

export const InfoSections: React.FC<InfoSectionsProps> = ({ t }) => {
  return (
    <div className="space-y-16 mt-16 pb-16">
      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[#0F2537] mb-6 tracking-tight">
          {t.howItWorksTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D8E6F3] rounded-xl p-6">
            <Cpu className="w-5 h-5 text-sky-600 mb-3" />
            <h3 className="text-sm font-bold text-[#0F2537] mb-2">
              {t.step1Title}
            </h3>
            <p className="text-xs leading-relaxed text-[#4A6B88]">
              {t.step1Desc}
            </p>
          </div>

          <div className="bg-white border border-[#D8E6F3] rounded-xl p-6">
            <FileCheck2 className="w-5 h-5 text-sky-600 mb-3" />
            <h3 className="text-sm font-bold text-[#0F2537] mb-2">
              {t.step2Title}
            </h3>
            <p className="text-xs leading-relaxed text-[#4A6B88]">
              {t.step2Desc}
            </p>
          </div>

          <div className="bg-white border border-[#D8E6F3] rounded-xl p-6">
            <Shield className="w-5 h-5 text-sky-600 mb-3" />
            <h3 className="text-sm font-bold text-[#0F2537] mb-2">
              {t.step3Title}
            </h3>
            <p className="text-xs leading-relaxed text-[#4A6B88]">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Supported AI Signatures Section */}
      <section id="ai-signatures" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F2537] tracking-tight mb-1.5">
            {t.supportedSignaturesTitle}
          </h2>
          <p className="text-xs text-[#4A6B88]">{t.supportedSignaturesDesc}</p>
        </div>

        <div className="bg-white border border-[#D8E6F3] rounded-xl divide-y divide-[#E5EFF8]">
          {SUPPORTED_AI_SYSTEMS.map((sys) => (
            <div
              key={sys.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4"
            >
              <span className="text-xs font-semibold text-[#0F2537]">
                {sys.name}
              </span>
              <span className="text-xs font-mono text-[#4A6B88]">
                {sys.keys}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Notice Section */}
      <section id="privacy" className="scroll-mt-24 space-y-4">
        <div className="bg-[#EAF3FB] border border-[#C5D9EC] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white rounded-lg border border-[#D8E6F3] shrink-0">
            <Lock className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0F2537] mb-1">
              {t.privacyNoticeTitle}
            </h2>
            <p className="text-xs leading-relaxed text-[#385874]">
              {t.privacyNoticeDesc}
            </p>
          </div>
        </div>

        {/* Steganographic Watermark (SynthID) Technical Disclaimer */}
        <div className="bg-white border border-[#D8E6F3] rounded-xl px-6 py-4">
          <h3 className="text-xs font-bold text-[#0F2537] mb-1">
            {t.stegoNoticeTitle}
          </h3>
          <p className="text-xs leading-relaxed text-[#4A6B88]">
            {t.stegoNoticeDesc}
          </p>
        </div>
      </section>
    </div>
  );
};
