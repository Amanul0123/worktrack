import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';

export default function ExportMenu({ filters = {} }) {
  const { t } = useTranslation('admin');
  const [open, setOpen] = useState(false);

  const handleExport = (format) => {
    const url = adminService.exportUrl(format, filters);
    window.open(url, '_blank');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Download size={15} />
        {t('export', { ns: 'common' })}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-2 z-20 bg-surface-raised border border-surface-raised rounded-card shadow-xl min-w-40">
            <button
              onClick={() => handleExport('xlsx')}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-cream hover:bg-midnight transition-colors"
            >
              <FileSpreadsheet size={15} className="text-emerald" />
              {t('export_xlsx')}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-cream hover:bg-midnight transition-colors"
            >
              <FileText size={15} className="text-rose" />
              {t('export_pdf')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
