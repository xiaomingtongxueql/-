/**
 * Timeline Layout Engine
 * 用途：将年份数据转换为绝对定位坐标，并处理双列碰撞检测
 */
class TimelineLayoutEngine {
    /**
     * @param {Object} config - 配置对象
     * @param {number} config.pixelsPerYear - 每年对应的像素高度
     * @param {number} config.minYear - 时间线起始年份
     * @param {number} [config.collisionBuffer=20] - 碰撞检测缓冲区（px）
     * @param {number} [config.itemHeight=80] - 单个事件卡片的默认高度（px）
     */
    constructor(config) {
        this.pixelsPerYear = config.pixelsPerYear;
        this.minYear = config.minYear;
        this.collisionBuffer = config.collisionBuffer || 20;
        this.itemHeight = config.itemHeight || 80;

        // 双轨道水位线（记录每列的最后底部位置）
        this.watermarks = {
            left: 0,
            right: 0
        };
    }

    /**
     * 主入口：处理事件数组，添加布局信息
     * @param {Array} events - 事件数组 [{year, type, ...}, ...]
     * @returns {Array} 添加了 top、column 属性的事件数组
     */
    layout(events) {
        if (!Array.isArray(events) || events.length === 0) {
            return events; // 卫语句：空数组直接返回
        }

        // 重置水位线
        this.watermarks = { left: 0, right: 0 };

        // 按年份升序排序（确保时间线从上到下）
        const sortedEvents = [...events].sort((a, b) => a.year - b.year);

        // 为每个事件计算布局
        return sortedEvents.map(event => this._processEvent(event));
    }

    /**
     * 处理单个事件
     * @private
     */
    _processEvent(event) {
        // 1. 判断列
        const column = this._assignColumn(event.type);

        // 2. 计算理论 top 位置
        const theoreticalTop = this._calculatePosition(event.year);

        // 3. 碰撞检测并修正
        const actualTop = this._resolveCollision(theoreticalTop, column);

        // 4. 更新该列的水位线
        const eventBottom = actualTop + this.itemHeight;
        this.watermarks[column] = eventBottom;

        // 5. 返回增强后的事件对象
        return {
            ...event,
            column,
            top: actualTop
        };
    }

    /**
     * 根据类型分配列
     * @private
     * @param {string} type - 事件类型
     * @returns {'left'|'right'}
     */
    _assignColumn(type) {
        if (!type) return 'left'; // 卫语句：无类型默认左列

        const lowerType = type.toLowerCase();

        // 中国事件 -> 左列
        if (lowerType.includes('china') || lowerType.includes('cn')) {
            return 'left';
        }

        // 世界事件 -> 右列
        if (lowerType.includes('world') || lowerType.includes('global')) {
            return 'right';
        }

        // 默认左列
        return 'left';
    }

    /**
     * 计算理论位置（基于年份）
     * @private
     * @param {number} year - 事件年份
     * @returns {number} top 值（px）
     */
    _calculatePosition(year) {
        return (year - this.minYear) * this.pixelsPerYear;
    }

    /**
     * 碰撞检测与修正
     * @private
     * @param {number} theoreticalTop - 理论 top 值
     * @param {'left'|'right'} column - 所在列
     * @returns {number} 修正后的 top 值
     */
    _resolveCollision(theoreticalTop, column) {
        const lastBottom = this.watermarks[column];
        const minAllowedTop = lastBottom + this.collisionBuffer;

        // 如果理论位置低于水位线 + 缓冲区，使用理论位置
        if (theoreticalTop >= minAllowedTop) {
            return theoreticalTop;
        }

        // 否则，推到水位线以下
        return minAllowedTop;
    }

    /**
     * 重置引擎状态（用于重新布局）
     */
    reset() {
        this.watermarks = { left: 0, right: 0 };
    }
}

// 如果在浏览器环境中使用
if (typeof window !== 'undefined') {
    window.TimelineLayoutEngine = TimelineLayoutEngine;
}

// 如果在 Node.js 环境中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineLayoutEngine;
}
