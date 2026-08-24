/**
 * dsh-wbtree — host half.
 *
 * Nothing to do host-side: the plugin is pure browser UI. This file exists so
 * the cordis loader row resolves; the browser half is picked up by
 * dsh-client-modules through the package's dsh.client declaration.
 */

/** Plugin identity for cordis.yml rows. */
export const name = "dsh-wbtree";

/** No host contributions. */
export function apply() {}
