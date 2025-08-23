"use client";

import { useEffect } from "react";
import Image from "next/image";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
          <Image
            src="/logo.png"
            alt="Failnet Logo"
            width={800}
            height={353}
            className="h-12 w-auto"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              📝 投稿の仕方
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <p>1. ページ上部の投稿フォームに失敗談や学んだことを入力</p>
              <p>2. カテゴリを選択（任意）</p>
              <p>3. 「投稿する」ボタンをクリック</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              😊 リアクションの使い方
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <p>• 投稿の下にある「+」ボタンをクリックしてリアクションを追加</p>
              <p>• 既存のリアクションをクリックして同じリアクションを追加</p>
              <p>• 様々な絵文字で感情や共感を表現できます</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              📤 シェア機能
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <p>各投稿の右下にある2つのボタンでシェアできます：</p>
              <p>
                • <strong>画像アイコン</strong>
                ：投稿を画像として生成してクリップボードにコピー
              </p>
              <p>
                • <strong>リンクアイコン</strong>
                ：投稿のURLをクリップボードにコピー
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              💡 FailNetについて
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <p>FailNetは失敗から学び、成長するためのコミュニティです。</p>
              <p>
                失敗談をシェアしてお互いに学び合い、二の轍を踏まないことを目的としています
              </p>
              <p>どんどん失敗談を投稿してください！</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
