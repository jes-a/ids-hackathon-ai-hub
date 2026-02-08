'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Users, Layers } from '@/components/icons';
import { mockQuestions } from '@/utils/mockQuestions';

interface TrendData {
  date: string;
  count: number;
}

interface PatternInsight {
  id: string;
  pattern: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  affectedTeams: string[];
  relatedComponents: string[];
}

export function TrendInsights() {
  const insights: PatternInsight[] = useMemo(
    () => [
      {
        id: 'i1',
        pattern: 'Drawer component confusion',
        description:
          'Multiple teams are uncertain about when to use Drawer vs Modal for multi-step workflows. 8 questions in the last 7 days across 4 teams.',
        impact: 'high',
        recommendation:
          'Create a decision tree or usage guidance document that clearly differentiates Drawer and Modal use cases. Consider adding examples for multi-step flows, settings panels, and data filtering.',
        affectedTeams: ['Growth', 'Platform', 'Analytics', 'Enterprise'],
        relatedComponents: ['Drawer', 'Modal'],
      },
      {
        id: 'i2',
        pattern: 'DataTable customization requests',
        description: 'Designers are asking about advanced DataTable features like validation, drag-and-drop, and custom pagination.',
        impact: 'medium',
        recommendation:
          'Document DataTable extension patterns or create compound components for common customizations. May indicate need for DataTable v2 with built-in extensibility.',
        affectedTeams: ['Platform', 'Analytics'],
        relatedComponents: ['DataTable'],
      },
      {
        id: 'i3',
        pattern: 'Form button spacing inconsistency',
        description: 'Questions about button spacing and destructive action styling suggest unclear form patterns.',
        impact: 'medium',
        recommendation:
          'Add form layout templates to Figma library with pre-defined button groups. Document spacing tokens for form actions.',
        affectedTeams: ['Core', 'Platform'],
        relatedComponents: ['Button', 'Form'],
      },
      {
        id: 'i4',
        pattern: 'Mobile adaptation uncertainty',
        description:
          'Designers asking how desktop components translate to mobile experiences, particularly for Drawer.',
        impact: 'high',
        recommendation:
          'Create mobile-specific guidance or responsive behavior documentation. Consider mobile-first component variants.',
        affectedTeams: ['Mobile', 'Growth'],
        relatedComponents: ['Drawer', 'Modal', 'Navigation'],
      },
      {
        id: 'i5',
        pattern: 'Toggle vs Checkbox confusion',
        description: 'Recurring questions about when to use Toggle vs Checkbox for binary choices.',
        impact: 'low',
        recommendation:
          'Update component documentation with clear use cases. Toggle for immediate state changes, Checkbox for form selections.',
        affectedTeams: ['Core'],
        relatedComponents: ['Toggle', 'Checkbox'],
      },
    ],
    []
  );

  const weeklyTrend: TrendData[] = useMemo(() => {
    const days = ['Feb 1', 'Feb 2', 'Feb 3', 'Feb 4', 'Feb 5', 'Feb 6', 'Feb 7'];
    const counts = [2, 1, 3, 2, 3, 4, 3];
    return days.map((date, i) => ({ date, count: counts[i] }));
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'var(--carbon-support-error)';
      case 'medium':
        return 'var(--carbon-support-warning)';
      default:
        return 'var(--carbon-support-info)';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return AlertCircle;
      case 'medium':
        return TrendingUp;
      default:
        return TrendingDown;
    }
  };

  const totalQuestions = weeklyTrend.reduce((sum, d) => sum + d.count, 0);
  const avgQuestionsPerDay = (totalQuestions / weeklyTrend.length).toFixed(1);

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
          Trend insights
        </h1>
        <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
          Pattern detection and strategic recommendations for design system evolution
        </p>
      </header>

      <div className="hub-view-scroll" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
        <div className="trend-container">
          <div
            className="trend-summary"
            style={{
              backgroundColor: 'var(--carbon-layer-01)',
              borderColor: 'var(--carbon-border-subtle)',
              borderRadius: 'var(--carbon-radius)',
            }}
          >
            <h2 className="text-lg mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
              7-day activity summary
            </h2>
            <div className="trend-summary-grid">
              <div>
                <div className="trend-summary-row">
                  <Clock width={16} height={16} style={{ color: 'var(--carbon-text-secondary)' }} />
                  <p className="text-xs" style={{ color: 'var(--carbon-text-secondary)' }}>
                    Total questions
                  </p>
                </div>
                <p className="text-2xl" style={{ color: 'var(--carbon-text-primary)' }}>
                  {totalQuestions}
                </p>
              </div>
              <div>
                <div className="trend-summary-row">
                  <TrendingUp width={16} height={16} style={{ color: 'var(--carbon-text-secondary)' }} />
                  <p className="text-xs" style={{ color: 'var(--carbon-text-secondary)' }}>
                    Avg per day
                  </p>
                </div>
                <p className="text-2xl" style={{ color: 'var(--carbon-text-primary)' }}>
                  {avgQuestionsPerDay}
                </p>
              </div>
              <div>
                <div className="trend-summary-row">
                  <Users width={16} height={16} style={{ color: 'var(--carbon-text-secondary)' }} />
                  <p className="text-xs" style={{ color: 'var(--carbon-text-secondary)' }}>
                    Active teams
                  </p>
                </div>
                <p className="text-2xl" style={{ color: 'var(--carbon-text-primary)' }}>
                  6
                </p>
              </div>
              <div>
                <div className="trend-summary-row">
                  <Layers width={16} height={16} style={{ color: 'var(--carbon-text-secondary)' }} />
                  <p className="text-xs" style={{ color: 'var(--carbon-text-secondary)' }}>
                    Patterns detected
                  </p>
                </div>
                <p className="text-2xl" style={{ color: 'var(--carbon-text-primary)' }}>
                  {insights.length}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs mb-3" style={{ color: 'var(--carbon-text-secondary)' }}>
                Daily question volume
              </p>
              <div className="trend-bars">
                {weeklyTrend.map((day, i) => (
                  <div key={i} className="trend-bar">
                    <div className="trend-bar-column">
                      <div
                        className="trend-bar-fill"
                        style={{
                          height: `${(day.count / Math.max(...weeklyTrend.map((d) => d.count))) * 100}%`,
                          backgroundColor: 'var(--carbon-interactive)',
                        }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--carbon-text-secondary)' }}>
                      {day.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
              Detected patterns ({insights.length})
            </h2>
            <div className="trend-list">
              {insights.map((insight) => {
                const ImpactIcon = getImpactIcon(insight.impact);
                return (
                  <div
                    key={insight.id}
                    className="trend-card"
                    style={{
                      backgroundColor: 'var(--carbon-layer-01)',
                      borderColor: 'var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <div className="trend-card-header">
                      <div className="trend-card-title">
                        <h3 className="text-base mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                          {insight.pattern}
                        </h3>
                      </div>
                      <div className="trend-card-impact">
                        <ImpactIcon width={16} height={16} style={{ color: getImpactColor(insight.impact) }} />
                        <span
                          className="trend-impact-tag"
                          style={{
                            backgroundColor: 'var(--carbon-bg-secondary)',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: getImpactColor(insight.impact),
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mb-4" style={{ color: 'var(--carbon-text-secondary)' }}>
                      {insight.description}
                    </p>

                    <div className="trend-meta">
                      <div>
                        <p className="text-xs mb-2" style={{ color: 'var(--carbon-text-placeholder)' }}>
                          Affected teams
                        </p>
                        <div className="trend-tags">
                          {insight.affectedTeams.map((team) => (
                            <span
                              key={team}
                              className="trend-tag"
                              style={{
                                backgroundColor: 'var(--carbon-bg-secondary)',
                                borderColor: 'var(--carbon-border-subtle)',
                                color: 'var(--carbon-text-secondary)',
                                borderRadius: 'var(--carbon-radius)',
                              }}
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs mb-2" style={{ color: 'var(--carbon-text-placeholder)' }}>
                          Related components
                        </p>
                        <div className="trend-tags">
                          {insight.relatedComponents.map((comp) => (
                            <span
                              key={comp}
                              className="trend-tag trend-tag-primary"
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
                      </div>
                    </div>

                    <div
                      className="trend-recommendation"
                      style={{
                        backgroundColor: 'var(--carbon-bg-secondary)',
                        borderColor: 'var(--carbon-interactive)',
                      }}
                    >
                      <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-placeholder)' }}>
                        Guardian recommendation
                      </p>
                      <p className="text-sm" style={{ color: 'var(--carbon-text-primary)' }}>
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
