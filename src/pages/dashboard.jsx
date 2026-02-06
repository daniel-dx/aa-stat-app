// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, TrendingUp, Activity, Database, UserCheck, UserX } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function Dashboard(props) {
  const {
    toast
  } = useToast();
  const [userCount, setUserCount] = useState(0);
  const [realUserCount, setRealUserCount] = useState(0);
  const [virtualUserCount, setVirtualUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUserCount();
  }, []);
  const fetchUserCount = async () => {
    try {
      setLoading(true);
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();

      // 获取用户总数
      const totalResult = await db.collection('aa_user').count();
      if (totalResult && totalResult.total !== undefined) {
        setUserCount(totalResult.total);
      } else {
        setUserCount(0);
      }

      // 获取真实用户数量（isVirtual 为 false 或不存在该字段）
      const realUserResult = await db.collection('aa_user').where({
        $or: [{
          isVirtual: false
        }, {
          isVirtual: {
            $exists: false
          }
        }]
      }).count();
      if (realUserResult && realUserResult.total !== undefined) {
        setRealUserCount(realUserResult.total);
      } else {
        setRealUserCount(0);
      }

      // 获取虚拟用户数量（isVirtual 为 true）
      const virtualUserResult = await db.collection('aa_user').where({
        isVirtual: true
      }).count();
      if (virtualUserResult && virtualUserResult.total !== undefined) {
        setVirtualUserCount(virtualUserResult.total);
      } else {
        setVirtualUserCount(0);
      }
    } catch (error) {
      console.error('获取用户数量失败:', error);
      toast({
        title: '获取数据失败',
        description: error.message || '无法获取用户统计数据',
        variant: 'destructive'
      });
      setUserCount(0);
      setRealUserCount(0);
      setVirtualUserCount(0);
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white" style={{
              fontFamily: 'Space Mono, monospace'
            }}>
                统计面板
              </h1>
            </div>
            <div className="text-slate-400 text-sm" style={{
            fontFamily: 'JetBrains Mono, monospace'
          }}>
              {new Date().toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* User Total Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    用户总数
                  </h2>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {userCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      位用户
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-orange-500" />
                <span>实时数据统计</span>
              </div>
            </div>
          </div>

          {/* Real User Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    真实用户
                  </h2>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {realUserCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      位用户
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>真实用户统计</span>
              </div>
            </div>
          </div>

          {/* Virtual User Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    虚拟用户
                  </h2>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <UserX className="w-6 h-6 text-amber-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {virtualUserCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      位用户
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-amber-500" />
                <span>虚拟用户统计</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300" style={{
                fontFamily: 'Space Mono, monospace'
              }}>
                  数据源信息
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>集合名称</span>
                  <span className="text-slate-300 text-sm font-mono">aa_user</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>数据类型</span>
                  <span className="text-slate-300 text-sm font-mono">NoSQL</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>更新时间</span>
                  <span className="text-slate-300 text-sm font-mono">实时</span>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Future Stats */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 border-dashed">
              <div className="flex items-center justify-center h-32 text-slate-500">
                <div className="text-center">
                  <p className="text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>更多统计指标</p>
                  <p className="text-xs text-slate-600 mt-1" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>待扩展...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
}