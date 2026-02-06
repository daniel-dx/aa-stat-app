// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, TrendingUp, Activity, Database, UserCheck, UserX, FolderKanban, Receipt, Home, DollarSign } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function Dashboard(props) {
  const {
    toast
  } = useToast();
  const [userCount, setUserCount] = useState(0);
  const [realUserCount, setRealUserCount] = useState(0);
  const [virtualUserCount, setVirtualUserCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [currencyRateCount, setCurrencyRateCount] = useState(0);
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

      // 获取项目总数
      const projectResult = await db.collection('aa_project').count();
      if (projectResult && projectResult.total !== undefined) {
        setProjectCount(projectResult.total);
      } else {
        setProjectCount(0);
      }

      // 获取账单总数
      const billResult = await db.collection('aa_bill').count();
      if (billResult && billResult.total !== undefined) {
        setBillCount(billResult.total);
      } else {
        setBillCount(0);
      }

      // 获取家庭总数
      const familyResult = await db.collection('aa_family').count();
      if (familyResult && familyResult.total !== undefined) {
        setFamilyCount(familyResult.total);
      } else {
        setFamilyCount(0);
      }

      // 获取汇率总数
      const currencyRateResult = await db.collection('aa_currency_rate').count();
      if (currencyRateResult && currencyRateResult.total !== undefined) {
        setCurrencyRateCount(currencyRateResult.total);
      } else {
        setCurrencyRateCount(0);
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
      setProjectCount(0);
      setBillCount(0);
      setFamilyCount(0);
      setCurrencyRateCount(0);
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

          {/* Project Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    项目总数
                  </h2>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FolderKanban className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {projectCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      个项目
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span>项目统计</span>
              </div>
            </div>
          </div>

          {/* Bill Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    账单总数
                  </h2>
                </div>
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <Receipt className="w-6 h-6 text-rose-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {billCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      笔账单
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-rose-500" />
                <span>账单统计</span>
              </div>
            </div>
          </div>

          {/* Family Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    家庭总数
                  </h2>
                </div>
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Home className="w-6 h-6 text-cyan-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {familyCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      个家庭
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-cyan-500" />
                <span>家庭统计</span>
              </div>
            </div>
          </div>

          {/* Currency Rate Stats Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-300 mb-1" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                    汇率总数
                  </h2>
                </div>
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-violet-500" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {loading ? <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>加载中...</span>
                  </div> : <>
                    <span className="text-4xl font-bold text-white" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>
                      {currencyRateCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                      条汇率
                    </span>
                  </>}
              </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
                <TrendingUp className="w-3 h-3 text-violet-500" />
                <span>汇率统计</span>
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