// dsh-wbtree — browser half (client plugin bundle).
//
// Sidebar workspace dropdown + fork-lineage session tree. Shadows the shipped
// `sidebar.workspaces` occupant via a priority -1 registration.
//
// Loaded by dsh-client-modules at /plugins/dsh-wbtree/client.js and executed
// through the vendored cordis Loader's lazy-CJS module table
// (window.__ModuleLoader__.load). The factory body is plain CJS with
// require() resolved against the shell's module table — the same shape the
// shipped ui-* packages' tsdown bundles emit.

window.__ModuleLoader__.load({
	id: "dsh-wbtree",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");

		//#region css
		const css = `
      .wbtree-root { display:flex; flex-direction:column; height:100%; min-height:0; }
      .wbtree-head { display:flex; gap:6px; padding:8px 10px 6px; align-items:center; }
      .wbtree-pick { flex:1; min-width:0; position:relative; }
      .wbtree-trigger { display:flex; align-items:center; gap:6px; width:100%; box-sizing:border-box; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); border:1px solid var(--dsw-alias-border-l1); border-radius:6px; padding:5px 8px; font-size:12px; cursor:pointer; font-family:inherit; }
      .wbtree-trigger:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
      .wbtree-trigger-label { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left; }
      .wbtree-arrow { flex-shrink:0; color:var(--dsw-alias-label-secondary); font-size:10px; }
      .wbtree-menu-backdrop { position:fixed; inset:0; z-index:1000; background:transparent; }
      .wbtree-menu { position:fixed; z-index:1001; box-sizing:border-box; background:var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2)); border:1px solid var(--dsw-alias-border-l1); border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.28); padding:4px; max-height:min(320px, 60vh); overflow-y:auto; }
      .wbtree-menu-item { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:6px; font-size:13px; color:var(--dsw-alias-label-primary); cursor:pointer; white-space:nowrap; }
      .wbtree-menu-item:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-1)); }
      .wbtree-check { flex-shrink:0; width:12px; color:var(--dsw-alias-brand-primary); font-size:11px; }
      .wbtree-menu-label { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; }
      .wbtree-body { flex:1; overflow-y:auto; padding:0 4px 12px; }
      .wbtree-row { position:relative; display:flex; align-items:center; gap:4px; height:30px; padding-right:4px; border-radius:6px; cursor:pointer; color:var(--dsw-alias-label-primary); font-size:13px; white-space:nowrap; }
      .wbtree-row:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-1)); }
      .wbtree-row.current { background:var(--dsw-alias-interactive-bg-active, var(--dsw-alias-bg-layer-2)); }
      .wbtree-caret { position:relative; width:14px; flex-shrink:0; text-align:center; color:var(--dsw-alias-label-secondary); font-size:10px; user-select:none; }
      .wbtree-guide { position:absolute; background:var(--dsw-alias-border-l2, var(--dsw-alias-border-l1)); pointer-events:none; }
      .wbtree-title { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; }
      .wbtree-time { flex-shrink:0; color:var(--dsw-alias-label-secondary); font-size:11px; }
      .wbtree-more { flex-shrink:0; width:20px; height:20px; border:none; background:transparent; color:var(--dsw-alias-label-secondary); border-radius:4px; cursor:pointer; font-size:13px; line-height:1; opacity:0; padding:0; font-family:inherit; }
      .wbtree-row:hover .wbtree-more, .wbtree-more.open { opacity:1; }
      .wbtree-more:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); color:var(--dsw-alias-label-primary); }
      .wbtree-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; background:transparent; }
      .wbtree-dot.running { background:var(--dsw-alias-state-success-primary); }
      .wbtree-dot.pending { background:var(--dsw-alias-state-warn-primary); }
      .wbtree-dot.completed { background:var(--dsw-alias-label-secondary); }
      .wbtree-empty { padding:12px; color:var(--dsw-alias-label-secondary); font-size:12px; text-align:center; }
      .wbtree-dialog-backdrop { position:fixed; inset:0; z-index:1200; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }
      .wbtree-dialog { box-sizing:border-box; width:320px; max-width:calc(100vw - 32px); background:var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2)); border:1px solid var(--dsw-alias-border-l1); border-radius:10px; box-shadow:0 8px 28px rgba(0,0,0,0.35); padding:14px; display:flex; flex-direction:column; gap:10px; }
      .wbtree-dialog-title { font-size:13px; font-weight:600; color:var(--dsw-alias-label-primary); }
      .wbtree-dialog-input { box-sizing:border-box; width:100%; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); border-radius:6px; color:var(--dsw-alias-label-primary); font-size:13px; padding:7px 9px; font-family:inherit; outline:none; }
      .wbtree-dialog-input:focus { border-color:var(--dsw-alias-brand-primary); }
      .wbtree-dialog-error { font-size:12px; color:var(--dsw-alias-state-danger-primary, #e5484d); }
      .wbtree-dialog-actions { display:flex; justify-content:flex-end; gap:8px; }
      .wbtree-btn { border-radius:6px; font-size:12px; padding:6px 12px; cursor:pointer; font-family:inherit; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); }
      .wbtree-btn:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
      .wbtree-btn.primary { background:var(--dsw-alias-brand-primary); border-color:transparent; color:#fff; }
      .wbtree-btn.primary:hover { filter:brightness(1.1); }
      .wbtree-btn:disabled { opacity:0.55; cursor:default; }
      .wbtree-rail { display:flex; flex-direction:column; gap:6px; padding:8px 4px; align-items:center; }
      .wbtree-rail-btn { width:32px; height:32px; border-radius:8px; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); border:1px solid var(--dsw-alias-border-l1); font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
      .wbtree-rail-btn:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }
      .wbtree-rail-btn.current { background:var(--dsw-alias-interactive-bg-active, var(--dsw-alias-bg-layer-2)); color:var(--dsw-alias-brand-primary); }
    `;
		const tagId = "dsh-wbtree/wbtree.css";
		function insertStyles() {
			if (typeof document === "undefined") return () => {};
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return () => {};
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-wbtree";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
			return () => { tag.remove(); };
		}
		//#endregion

		// Compact tree guide lines: the trunk of ancestor level k is keyed on the
		// branch starter at depth k+1 (thisChain[k+1]). A last branch closes its
		// ancestor's trunk at the branch's starting row; deeper rows of that branch
		// draw no trunk for that ancestor. The direct-child row stops the trunk at
		// the elbow when it is the last child.
		const guideLines = (depth, showOwn, thisChain) => {
			const els = [];
			for (let k = 0; k < depth; k++) {
				const branchIsLast = thisChain !== undefined && thisChain[k + 1] === true;
				if (depth > k + 1 && branchIsLast) continue;
				const stop = depth === k + 1 && branchIsLast;
				els.push(React.createElement("span", {
					key: "gv" + k,
					className: "wbtree-guide",
					style: stop
						? { left: 8 + k * 14 + 7, top: 0, height: 15, width: 1 }
						: { left: 8 + k * 14 + 7, top: 0, height: "100%", width: 1 }
				}));
			}
			if (depth > 0) {
				els.push(React.createElement("span", {
					key: "gh",
					className: "wbtree-guide",
					style: { left: 8 + (depth - 1) * 14 + 7, top: 14, width: 14, height: 2 }
				}));
			}
			if (showOwn) {
				els.push(React.createElement("span", {
					key: "gvown",
					className: "wbtree-guide",
					style: { left: 8 + depth * 14 + 7, top: 15, height: 15, width: 1 }
				}));
			}
			return els;
		};

		function Browser(props) {
			const { wide, expandSidebar, useSessions, useWorkspaces, open, startSession, forkSession, archiveSession, renameSession } = props;
			const sessionsState = useSessions((s) => s);
			const workspacesState = useWorkspaces((s) => s);
			const items = workspacesState.items;
			const byId = sessionsState.byId;
			const current = sessionsState.current;
			const archived = workspacesState.archivedSessionIds;
			const [selected, setSelected] = React.useState(null);
			const [expanded, setExpanded] = React.useState(() => new Set());
			const [menuOpen, setMenuOpen] = React.useState(false);
			const [menuRect, setMenuRect] = React.useState(null);
			const [rowMenu, setRowMenu] = React.useState(null);
			const [renameTarget, setRenameTarget] = React.useState(null);
			const [renameDraft, setRenameDraft] = React.useState("");
			const [renaming, setRenaming] = React.useState(false);
			const [renameError, setRenameError] = React.useState(null);

			const effective = React.useMemo(() => {
				if (selected !== null) {
					if (selected === "" || items.some((w) => w.workspaceId === selected)) return selected;
				}
				if (current !== undefined) {
					const w = items.find((w) => w.sessionIds.includes(current));
					if (w !== undefined) return w.workspaceId;
				}
				if (workspacesState.recentWorkspaceId !== undefined && items.some((w) => w.workspaceId === workspacesState.recentWorkspaceId)) {
					return workspacesState.recentWorkspaceId;
				}
				return items.length > 0 ? items[0].workspaceId : "";
			}, [selected, items, current, workspacesState.recentWorkspaceId]);

			const tree = React.useMemo(() => {
				const accountSet = new Set();
				for (const w of items) for (const id of w.sessionIds) accountSet.add(id);
				let ids;
				if (effective === "") {
					ids = sessionsState.ids.filter((id) => !accountSet.has(id));
				} else {
					const w = items.find((w) => w.workspaceId === effective);
					ids = w !== undefined ? w.sessionIds.slice() : [];
				}
				const archivedSet = new Set(archived);
				const visibleSet = new Set();
				for (const id of ids) {
					const s = byId[id];
					if (s === undefined) continue;
					if (archivedSet.has(id)) continue;
					if (s.blank && id !== current) continue;
					visibleSet.add(id);
				}
				const children = new Map();
				for (const id of visibleSet) {
					const parentId = byId[id].parentId;
					if (parentId !== undefined && visibleSet.has(parentId)) {
						if (!children.has(parentId)) children.set(parentId, []);
						children.get(parentId).push(id);
					}
				}
				for (const arr of children.values()) arr.sort((a, b) => byId[b].updatedAt - byId[a].updatedAt);
				const roots = [];
				for (const id of visibleSet) {
					const parentId = byId[id].parentId;
					if (parentId === undefined || !visibleSet.has(parentId)) roots.push(id);
				}
				if (effective === "") {
					roots.sort((a, b) => byId[b].updatedAt - byId[a].updatedAt);
				} else {
					const order = new Map(ids.map((id, i) => [id, i]));
					roots.sort((a, b) => (order.get(a) ?? Infinity) - (order.get(b) ?? Infinity));
				}
				return { roots, children, visibleSet };
			}, [effective, items, sessionsState.ids, byId, archived, current]);

			// Workspace switch: reset to default-expanded plus the current
			// session's ancestor chain. Session switch (below): only reveal the
			// clicked session's ancestors, so manually collapsed branches stay
			// collapsed.
			React.useEffect(() => {
				setExpanded(() => {
					const next = new Set();
					for (const [p] of tree.children) next.add(p);
					let id = current;
					while (id !== undefined) {
						const s = byId[id];
						if (s === undefined || s.parentId === undefined) break;
						if (tree.visibleSet.has(s.parentId)) next.add(s.parentId);
						id = s.parentId;
					}
					return next;
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [effective]);

			React.useEffect(() => {
				setExpanded((prev) => {
					const next = new Set(prev);
					let added = false;
					let id = current;
					while (id !== undefined) {
						const s = byId[id];
						if (s === undefined || s.parentId === undefined) break;
						if (tree.visibleSet.has(s.parentId) && !next.has(s.parentId)) {
							next.add(s.parentId);
							added = true;
						}
						id = s.parentId;
					}
					return added ? next : prev;
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [current]);

			const t = props.t;
			const newSessionLabel = t("session.new");
			const ungroupedLabel = t("group.ungrouped");
			const titleOf = (id) => (byId[id].blank ? newSessionLabel : byId[id].displayTitle);

			const labels = (ids) => {
				const counts = new Map();
				for (const id of ids) {
					const key = titleOf(id);
					counts.set(key, (counts.get(key) || 0) + 1);
				}
				const seen = new Map();
				const out = new Map();
				for (const id of ids) {
					const key = titleOf(id);
					const c = counts.get(key);
					if (c === 1) { out.set(id, key); continue; }
					const n = (seen.get(key) || 0) + 1;
					seen.set(key, n);
					out.set(id, n === 1 ? key : key + " (" + n + ")");
				}
				return out;
			};

			const fmtRelative = (ts) => {
				const d = Math.max(0, Date.now() - ts);
				if (d < 60000) return "now";
				const m = Math.floor(d / 60000);
				if (m < 60) return m + "m";
				const h = Math.floor(m / 60);
				if (h < 24) return h + "h";
				const days = Math.floor(h / 24);
				if (days < 30) return days + "d";
				const mo = Math.floor(days / 30);
				if (mo < 12) return mo + "mo";
				return Math.floor(mo / 12) + "y";
			};

			const toggle = (id) => {
				setExpanded((prev) => {
					const next = new Set(prev);
					if (next.has(id)) next.delete(id); else next.add(id);
					return next;
				});
			};

			const renderRows = (ids, depth, lastChain) => {
				const labelMap = labels(ids);
				const out = [];
				const n = ids.length;
				for (let i = 0; i < n; i++) {
					const id = ids[i];
					const s = byId[id];
					const kids = tree.children.get(id) || [];
					const isOpen = expanded.has(id);
					const hasVisibleChildren = kids.length > 0 && isOpen;
					const isLast = i === n - 1;
					const thisChain = lastChain.concat(isLast);
					const isCurrent = current === id;
					const dotClass = s.pendingInteraction !== undefined && s.pendingInteraction !== "none"
						? " pending"
						: s.running ? " running"
						: s.completed ? " completed" : "";
					const guides = guideLines(depth, hasVisibleChildren, thisChain);
					const moreOpen = rowMenu !== null && rowMenu.id === id;
					const row = React.createElement("div", {
						key: id,
						className: "wbtree-row" + (isCurrent ? " current" : ""),
						style: { paddingLeft: 8 + depth * 14 },
						onClick: () => open(id),
						title: s.displayTitle
					},
						...guides,
						React.createElement("span", {
							className: "wbtree-caret",
							onClick: (e) => { e.stopPropagation(); toggle(id); }
						}, kids.length > 0 ? (isOpen ? "▾" : "▸") : ""),
						React.createElement("span", { className: "wbtree-dot" + dotClass }),
						React.createElement("span", { className: "wbtree-title" }, labelMap.get(id)),
						React.createElement("span", { className: "wbtree-time" }, fmtRelative(s.updatedAt)),
						React.createElement("button", {
							className: "wbtree-more" + (moreOpen ? " open" : ""),
							"aria-label": "Session actions",
							onClick: (e) => {
								e.stopPropagation();
								if (moreOpen) { setRowMenu(null); return; }
								const r = e.currentTarget.getBoundingClientRect();
								setMenuOpen(false);
								setRowMenu({ id, top: r.bottom + 4, left: Math.max(8, r.right - 160) });
							}
						}, "⋯")
					);
					out.push(row);
					if (kids.length > 0 && isOpen) out.push.apply(out, renderRows(kids, depth + 1, thisChain));
				}
				return out;
			};

			const onNew = () => startSession(effective === "" ? undefined : effective);

			if (!wide) {
				const railBtns = [];
				railBtns.push(React.createElement("button", {
					key: "new", className: "wbtree-rail-btn", title: newSessionLabel, onClick: onNew
				}, "+"));
				for (const w of items) {
					railBtns.push(React.createElement("button", {
						key: w.workspaceId,
						className: "wbtree-rail-btn" + (effective === w.workspaceId ? " current" : ""),
						title: w.title,
						onClick: () => { setSelected(w.workspaceId); expandSidebar(); }
					}, w.title.charAt(0).toUpperCase()));
				}
				railBtns.push(React.createElement("button", {
					key: "ungrouped",
					className: "wbtree-rail-btn" + (effective === "" ? " current" : ""),
					title: ungroupedLabel,
					onClick: () => { setSelected(""); expandSidebar(); }
				}, "⋯"));
				return React.createElement("div", { className: "wbtree-rail" }, ...railBtns);
			}

			const effectiveTitle = effective === ""
				? ungroupedLabel
				: (() => { const w = items.find((w) => w.workspaceId === effective); return w !== undefined ? w.title : ungroupedLabel; })();

			const openMenu = (e) => {
				const r = e.currentTarget.getBoundingClientRect();
				setMenuRect({ top: r.bottom + 4, left: r.left, width: r.width });
				setRowMenu(null);
				setMenuOpen(true);
			};

			const pick = (value) => {
				setSelected(value);
				setMenuOpen(false);
			};

			const menuItems = [];
			for (const w of items) {
				const isCurrent = effective === w.workspaceId;
				menuItems.push(React.createElement("div", {
					key: w.workspaceId,
					className: "wbtree-menu-item",
					onClick: () => pick(w.workspaceId),
					title: w.title
				},
					React.createElement("span", { className: "wbtree-check" }, isCurrent ? "✓" : ""),
					React.createElement("span", { className: "wbtree-menu-label" }, w.title)
				));
			}
			const ungroupedCurrent = effective === "";
			menuItems.push(React.createElement("div", {
				key: "ungrouped",
				className: "wbtree-menu-item",
				onClick: () => pick(""),
				title: ungroupedLabel
			},
				React.createElement("span", { className: "wbtree-check" }, ungroupedCurrent ? "✓" : ""),
				React.createElement("span", { className: "wbtree-menu-label" }, ungroupedLabel)
			));

			// Per-session row menu (rename / fork / archive), mirroring the shipped list.
			const menuSession = rowMenu !== null ? byId[rowMenu.id] : undefined;
			const closeRowMenu = () => setRowMenu(null);
			const rowMenuItems = [];
			if (menuSession !== undefined) {
				rowMenuItems.push(React.createElement("div", {
					key: "rename",
					className: "wbtree-menu-item",
					onClick: () => {
						setRenameTarget({ sessionId: rowMenu.id, title: menuSession.displayTitle });
						setRenameDraft(menuSession.displayTitle);
						setRenameError(null);
						closeRowMenu();
					}
				}, React.createElement("span", { className: "wbtree-menu-label" }, t("rename"))));
				rowMenuItems.push(React.createElement("div", {
					key: "fork",
					className: "wbtree-menu-item",
					onClick: () => { forkSession(rowMenu.id); closeRowMenu(); }
				}, React.createElement("span", { className: "wbtree-menu-label" }, t("menu.fork"))));
				rowMenuItems.push(React.createElement("div", {
					key: "archive",
					className: "wbtree-menu-item",
					onClick: () => { archiveSession(rowMenu.id); closeRowMenu(); }
				}, React.createElement("span", { className: "wbtree-menu-label" }, t("menu.archiveSession"))));
			}

			const closeRename = () => {
				if (renaming) return;
				setRenameTarget(null);
				setRenameError(null);
			};
			const confirmRename = () => {
				const trimmed = renameDraft.trim();
				if (renaming || trimmed === "" || renameTarget === null) return;
				setRenaming(true);
				setRenameError(null);
				renameSession(renameTarget.sessionId, trimmed).then(() => {
					setRenaming(false);
					setRenameTarget(null);
				}).catch((reason) => {
					setRenaming(false);
					setRenameError(reason instanceof Error ? reason.message : String(reason));
				});
			};

			const body = tree.roots.length === 0
				? React.createElement("div", { className: "wbtree-empty" }, "—")
				: renderRows(tree.roots, 0, []);

			return React.createElement("div", { className: "wbtree-root" },
				React.createElement("div", { className: "wbtree-head" },
					React.createElement("div", { className: "wbtree-pick" },
						React.createElement("button", {
							className: "wbtree-trigger",
							onClick: openMenu,
							title: effectiveTitle,
							"aria-label": "Select workspace"
						},
							React.createElement("span", { className: "wbtree-trigger-label" }, effectiveTitle),
							React.createElement("span", { className: "wbtree-arrow" }, "▾")
						),
						menuOpen ? React.createElement("div", {
							className: "wbtree-menu-backdrop",
							onClick: () => setMenuOpen(false)
						}) : null,
						menuOpen && menuRect !== null
							? React.createElement("div", {
								className: "wbtree-menu",
								style: { top: menuRect.top, left: menuRect.left, width: menuRect.width }
							}, ...menuItems)
							: null
					)
				),
				React.createElement("div", { className: "wbtree-body" }, body),
				menuSession !== undefined ? React.createElement("div", {
					className: "wbtree-menu-backdrop",
					onClick: closeRowMenu
				}) : null,
				menuSession !== undefined
					? React.createElement("div", {
						className: "wbtree-menu",
						style: { top: rowMenu.top, left: rowMenu.left, width: 160 }
					}, ...rowMenuItems)
					: null,
				renameTarget !== null ? React.createElement("div", {
					className: "wbtree-dialog-backdrop",
					onClick: (e) => { if (e.target === e.currentTarget) closeRename(); }
				},
					React.createElement("div", { className: "wbtree-dialog" },
						React.createElement("div", { className: "wbtree-dialog-title" }, t("rename.session.title")),
						React.createElement("input", {
							className: "wbtree-dialog-input",
							value: renameDraft,
							autoFocus: true,
							disabled: renaming,
							"aria-label": t("field.sessionName"),
							onFocus: (e) => { e.target.select(); },
							onChange: (e) => { setRenameDraft(e.target.value); setRenameError(null); },
							onKeyDown: (e) => {
								if (e.nativeEvent.isComposing === true) return;
								if (e.key === "Enter") confirmRename();
								else if (e.key === "Escape") closeRename();
							}
						}),
						renameError !== null ? React.createElement("div", { className: "wbtree-dialog-error", role: "alert" }, renameError) : null,
						React.createElement("div", { className: "wbtree-dialog-actions" },
							React.createElement("button", { className: "wbtree-btn", onClick: closeRename, disabled: renaming }, t("cancel")),
							React.createElement("button", {
								className: "wbtree-btn primary",
								onClick: confirmRename,
								disabled: renaming || renameDraft.trim() === ""
							}, t("rename"))
						)
					)
				) : null
			);
		}

		const inject = [];

		function apply(ctx) {
			const slots = ctx.get("slots");
			if (slots === undefined) return;
			const sessions = ctx.get("sessions");
			const workspaces = ctx.get("workspaces");
			const locale = ctx.get("locale");
			if (sessions === undefined || workspaces === undefined) return;

			ctx.effect(() => insertStyles());

			const t = locale !== undefined ? locale.bind("workspace") : (key) => key;

			slots.inject("sidebar.workspaces", () => slots.register(
				{
					name: "sidebar.workspaces",
					priority: -1,
					registrant: "workspace-branch-tree",
					inject: () => ({
						open: (id) => sessions.open(id),
						startSession: (workspaceId) => workspaces.startSession(workspaceId),
						forkSession: (sessionId) => sessions.fork({ sessionId, increaseTitle: true })
							.then((childId) => sessions.open(childId))
							.catch(() => {}),
						archiveSession: (sessionId) => workspaces.archiveSession(sessionId)
							.catch((reason) => { console.warn("session archive rejected:", reason); }),
						renameSession: (sessionId, title) => {
							const binding = sessions.binding(sessionId);
							const session = binding !== undefined ? binding.session : undefined;
							if (session === undefined) return Promise.reject(new Error("unknown session"));
							return session.rename(title).then((result) => {
								if (!result.ok) throw new Error(result.error.message);
							});
						},
						t
					})
				},
				Browser
			));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
