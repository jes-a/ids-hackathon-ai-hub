'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Calendar,
  Video,
} from '@/components/icons';
import { mockQuestions, clusterQuestions, type QuestionCluster, type DesignerQuestion } from '@/utils/mockQuestions';
import { GuardianRecordModal } from '@/components/GuardianRecordModal';

export function GuardianDashboard() {
  const [selectedCluster, setSelectedCluster] = useState<QuestionCluster | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<DesignerQuestion | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [resolvedQuestionIds, setResolvedQuestionIds] = useState<Set<string>>(new Set());
  const [expandedResolvedId, setExpandedResolvedId] = useState<string | null>(null);
  const clusters = useMemo(() => clusterQuestions(mockQuestions), []);

  const handleSelectCluster = (cluster: QuestionCluster) => {
    setSelectedCluster(cluster);
    setSelectedQuestion(null);
    setExpandedResolvedId(null);
  };

  const handleQuestionClick = (question: DesignerQuestion) => {
    const isResolved = resolvedQuestionIds.has(question.id);
    const isCurrentlySelected = selectedQuestion?.id === question.id;
    setSelectedQuestion(isCurrentlySelected ? null : question);
    if (isResolved) {
      setExpandedResolvedId(isCurrentlySelected ? null : question.id);
    } else {
      setExpandedResolvedId(null);
    }
  };

  const handleAddDocumentation = (questionId: string) => {
    setResolvedQuestionIds((prev) => new Set(prev).add(questionId));
    setSelectedQuestion(null);
    setExpandedResolvedId(null);
  };

  const stats = {
    totalQuestions: mockQuestions.length,
    activeClusters: clusters.length,
    newTopics: clusters.filter((c) => c.trend === 'new').length,
    increasingTopics: clusters.filter((c) => c.trend === 'increasing').length,
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'new':
      case 'increasing':
        return TrendingUp;
      case 'decreasing':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'new':
        return 'var(--carbon-support-info)';
      case 'increasing':
        return 'var(--carbon-support-warning)';
      case 'decreasing':
        return 'var(--carbon-text-placeholder)';
      default:
        return 'var(--carbon-text-secondary)';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'Today';
    }
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="hub-view">
      <header
        className="hub-view-header"
        style={{
          backgroundColor: 'var(--carbon-bg-secondary)',
          borderColor: 'var(--carbon-border-subtle)',
        }}
      >
        <h1 className="text-2xl mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
          Design System Hub
        </h1>
        <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
          Monitor designer uncertainty and guide design system evolution
        </p>
      </header>

      <div
        className="hub-view-strip"
        style={{
          backgroundColor: 'var(--carbon-layer-01)',
          borderColor: 'var(--carbon-border-subtle)',
        }}
      >
        <div className="guardian-stats">
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
              Total questions (7 days)
            </p>
            <p className="text-3xl" style={{ color: 'var(--carbon-text-primary)' }}>
              {stats.totalQuestions}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
              Question clusters
            </p>
            <p className="text-3xl" style={{ color: 'var(--carbon-text-primary)' }}>
              {stats.activeClusters}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
              New topics
            </p>
            <p className="text-3xl" style={{ color: 'var(--carbon-support-info)' }}>
              {stats.newTopics}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
              Increasing topics
            </p>
            <p className="text-3xl" style={{ color: 'var(--carbon-support-warning)' }}>
              {stats.increasingTopics}
            </p>
          </div>
        </div>
      </div>

      <div className="guardian-main">
        <div
          className="guardian-list"
          style={{
            backgroundColor: 'var(--carbon-bg-primary)',
            borderColor: 'var(--carbon-border-subtle)',
          }}
        >
          <div className="guardian-list-inner">
            <h2 className="text-lg mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
              Question clusters
            </h2>
            <div className="guardian-list-items">
              {clusters.map((cluster) => {
                const TrendIcon = getTrendIcon(cluster.trend);
                return (
                  <button
                    key={cluster.id}
                    onClick={() => handleSelectCluster(cluster)}
                    className="guardian-cluster"
                    style={{
                      backgroundColor:
                        selectedCluster?.id === cluster.id ? 'var(--carbon-bg-hover)' : 'var(--carbon-layer-01)',
                      borderColor:
                        selectedCluster?.id === cluster.id
                          ? 'var(--carbon-interactive)'
                          : 'var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <div className="guardian-cluster-header">
                      <div className="guardian-cluster-info">
                        <h3 className="text-sm mb-1" style={{ color: 'var(--carbon-text-primary)' }}>
                          {cluster.topic}
                        </h3>
                        <div className="guardian-cluster-tags">
                          {cluster.component.map((comp) => (
                            <span
                              key={comp}
                              className="guardian-tag"
                              style={{
                                backgroundColor: 'var(--carbon-bg-secondary)',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-secondary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="guardian-cluster-trend">
                        <TrendIcon width={16} height={16} style={{ color: getTrendColor(cluster.trend) }} />
                        <span
                          className="guardian-trend-tag"
                          style={{
                            backgroundColor: 'var(--carbon-bg-secondary)',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: getTrendColor(cluster.trend),
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          {cluster.trend}
                        </span>
                      </div>
                    </div>
                    <div className="guardian-cluster-meta" style={{ color: 'var(--carbon-text-secondary)' }}>
                      <span>{cluster.frequency} questions</span>
                      <span>•</span>
                      <span>Last asked {formatDate(cluster.lastAsked)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="guardian-detail" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
          {selectedCluster ? (
            <div className="guardian-detail-inner">
              <div className="guardian-detail-header">
                <h2 className="text-xl mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                  {selectedCluster.topic}
                </h2>
                <div className="guardian-detail-tags">
                  {selectedCluster.component.map((comp) => (
                    <span
                      key={comp}
                      className="guardian-detail-tag"
                      style={{
                        backgroundColor: 'var(--carbon-interactive)',
                        borderColor: 'var(--carbon-interactive)',
                        color: 'var(--carbon-text-on-color)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
                <div className="guardian-detail-grid">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Frequency
                    </p>
                    <p className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                      {selectedCluster.frequency} questions
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Trend
                    </p>
                    <p className="text-lg" style={{ color: getTrendColor(selectedCluster.trend) }}>
                      {selectedCluster.trend}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Contexts
                    </p>
                    <p className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                      {selectedCluster.contexts.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                  Designer questions ({selectedCluster.questions.length})
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--carbon-text-secondary)' }}>
                  Click a question to see actions
                </p>
                <div className="guardian-questions">
                  {selectedCluster.questions.map((question) => (
                    <div
                      key={question.id}
                      onMouseLeave={() => setExpandedResolvedId(null)}
                      style={{ width: '100%' }}
                    >
                      <div
                        className={`guardian-question-wrap${resolvedQuestionIds.has(question.id) ? ' guardian-question-wrap--resolved' : ''}${resolvedQuestionIds.has(question.id) && expandedResolvedId === question.id ? ' guardian-question-wrap--resolved-expanded' : ''}`}
                      >
                        {resolvedQuestionIds.has(question.id) && (
                          <span className="guardian-question-badge">Resolved</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleQuestionClick(question)}
                          className="guardian-question"
                          style={{
                            backgroundColor:
                              selectedQuestion?.id === question.id
                                ? 'var(--carbon-bg-hover)'
                                : 'var(--carbon-layer-01)',
                            borderColor:
                              selectedQuestion?.id === question.id
                                ? 'var(--carbon-interactive)'
                                : 'var(--carbon-border-subtle)',
                            borderRadius: 'var(--carbon-radius)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <p
                            className="guardian-question-text text-sm mb-3"
                            style={{ color: 'var(--carbon-text-primary)' }}
                          >
                            &quot;{question.question}&quot;
                          </p>
                          <div className="guardian-question-meta" style={{ color: 'var(--carbon-text-secondary)' }}>
                            <span>{question.designer}</span>
                            <span>•</span>
                            <span>{question.team} team</span>
                            <span>•</span>
                            <span>{question.platform}</span>
                            <span>•</span>
                            <span>{formatDate(question.timestamp)}</span>
                          </div>
                        </button>
                      </div>
                      {selectedQuestion?.id === question.id && (
                        <div className="guardian-actions guardian-actions-animate">
                          <h3 className="text-sm mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                            Actions for this question
                          </h3>
                          <div className="guardian-actions-grid">
                            <button
                              onClick={() => selectedQuestion && handleAddDocumentation(selectedQuestion.id)}
                              className="guardian-action"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-primary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              <CheckCircle width={16} height={16} />
                              <span className="text-sm">Add documentation</span>
                            </button>
                            <button
                              onClick={() => alert('Usage rule creation workflow would open here')}
                              className="guardian-action"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-primary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              <AlertCircle width={16} height={16} />
                              <span className="text-sm">Define usage rule</span>
                            </button>
                            <button
                              onClick={() => alert('Discussion thread would be created for the design system team')}
                              className="guardian-action"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-primary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              <MessageCircle width={16} height={16} />
                              <span className="text-sm">Flag for discussion</span>
                            </button>
                            <button
                              onClick={() => alert('This topic would be acknowledged and tracked for future consideration')}
                              className="guardian-action"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-primary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              <Calendar width={16} height={16} />
                              <span className="text-sm">Acknowledge gap</span>
                            </button>
                            <button
                              onClick={() => setShowRecordModal(true)}
                              className="guardian-action"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-primary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              <Video width={16} height={16} />
                              <span className="text-sm">Add video</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="guardian-empty">
              <div className="guardian-empty-inner">
                <MessageCircle width={64} height={64} className="mx-auto mb-4" style={{ color: 'var(--carbon-text-placeholder)' }} />
                <h3 className="text-lg mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                  Select a question cluster
                </h3>
                <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
                  Choose a cluster to view details and take action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <GuardianRecordModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
      />
    </div>
  );
}
